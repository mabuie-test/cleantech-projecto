
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');
const { initMpesaPayment, validateMpesaCallback } = require('../services/mpesaService');
const { getIO } = require('../socket');

/**
 * POST /api/payments/mpesa/init
 * body: { orderId, amount, phone }
 */
async function initMpesa(req, res, next) {
  try {
    const { orderId, amount, phone } = req.body;
    if (!amount || !phone) return res.status(400).json({ error: 'amount and phone required' });

    const trx = new Transaction({ orderId: orderId || null, amount, phone, status: 'pending' });
    await trx.save();

    const resp = await initMpesaPayment({ amount, phone, transactionId: trx._id.toString(), accountReference: orderId || trx._id.toString(), description: `Order ${orderId || trx._id}` });

    if (resp.MerchantRequestID) trx.mpesaMerchantRequestId = resp.MerchantRequestID;
    if (resp.CheckoutRequestID) trx.mpesaCheckoutRequestId = resp.CheckoutRequestID;
    trx.raw = resp;
    await trx.save();

    res.json({ ok: true, trxId: trx._id, mpesa: resp });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payments/mpesa/callback
 */
async function mpesaCallback(req, res, next) {
  try {
    const payload = req.body;
    const parsed = validateMpesaCallback(payload);

    // find transaction by checkout/merchant id or fallback to phone+amount
    const trx = await Transaction.findOne({ $or: [{ mpesaCheckoutRequestId: parsed.CheckoutRequestID }, { mpesaMerchantRequestId: parsed.MerchantRequestID }] });

    if (!trx) {
      const newTrx = new Transaction({
        mpesaCheckoutRequestId: parsed.CheckoutRequestID,
        mpesaMerchantRequestId: parsed.MerchantRequestID,
        amount: parsed.Amount || 0,
        phone: parsed.PhoneNumber || '',
        status: parsed.ResultCode === 0 ? 'paid' : 'failed',
        raw: parsed
      });
      await newTrx.save();
      try { getIO().emit('payment_confirmed', { trx: newTrx }); } catch(e){}
      return res.json({ success: true });
    }

    trx.raw = parsed;
    trx.updatedAt = new Date();
    if (parsed.ResultCode === 0 || parsed.ResultCode === '0') {
      trx.status = 'paid';
      if (trx.orderId) {
        const order = await Order.findById(trx.orderId);
        if (order) {
          order.status = 'pending'; // payment confirmed; still waiting assignment
          await order.save();
          try { getIO().emit('payment_confirmed', { orderId: order._id, trxId: trx._id, order }); } catch(e){}
        }
      }
    } else {
      trx.status = 'failed';
    }
    await trx.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { initMpesa, mpesaCallback };