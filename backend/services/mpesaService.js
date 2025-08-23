/**
 * mpesaService.js
 * - Supports provider agnostic calls via MPESA_PROVIDER env var
 * - Built-in support for:
 *    - vodacom_mz (Vodacom Moçambique Open API style)
 *    - safaricom (Daraja / Safaricom STK Push style)
 *    - simulator (no external call, returns simulated accepted response)
 *
 * IMPORTANT: adjust endpoints and payloads to match the exact provider docs you obtained from Vodacom.
 * Vodacom M-Pesa Open API (Mozambique) info: Vodacom M-Pesa Open API page. 3
 */

const axios = require('axios');
const crypto = require('crypto');

const PROVIDER = (process.env.MPESA_PROVIDER || 'simulator').toLowerCase();
const API_URL = process.env.MPESA_API_URL;
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SERVICE_PROVIDER_CODE = process.env.MPESA_SERVICE_PROVIDER_CODE; // vodacom style
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL;

async function getOAuthToken() {
  if (!API_URL || !CONSUMER_KEY || !CONSUMER_SECRET) throw new Error('MPESA OAuth credentials not configured');
  const url = `${API_URL.replace(/\/$/, '')}/oauth/v1/generate?grant_type=client_credentials`;
  const resp = await axios.get(url, {
    auth: { username: CONSUMER_KEY, password: CONSUMER_SECRET },
    timeout: 8000
  });
  return resp.data.access_token || resp.data.accessToken || resp.data.token;
}

/**
 * Initiate payment according to provider
 * @param {Object} opts { amount, phone, transactionId, accountReference, description }
 */
async function initMpesaPayment({ amount, phone, transactionId, accountReference, description }) {
  if (PROVIDER === 'simulator') {
    // quick simulated response (useful for local dev / docker)
    return {
      simulated: true,
      MerchantRequestID: `MREQ_${Date.now()}`,
      CheckoutRequestID: `CREQ_${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Simulated request accepted for processing'
    };
  }

  if (PROVIDER === 'vodacom_mz') {
    // Vodacom MZ Open API - C2B style: payload and endpoint vary; this is a flexible attempt.
    try {
      const token = await getOAuthToken();
      // Typical C2B payload keys (adjust to Vodacom docs)
      const payload = {
        inputAmount: amount,
        inputCustomerMSISDN: phone,
        inputServiceProviderCode: SERVICE_PROVIDER_CODE || SHORTCODE,
        inputThirdPartyConversationID: transactionId,
        inputTransactionReference: accountReference || transactionId,
        inputPurchasedItemsDesc: description || `Order ${transactionId}`
      };
      // endpoint guessed; **you must update** to the exact endpoint from Vodacom portal
      const endpoint = `${API_URL.replace(/\/$/, '')}/openapi/c2b/v1/collect`;
      const resp = await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
      return resp.data;
    } catch (err) {
      console.warn('Vodacom M-Pesa call failed:', err.message);
      // fallback simulation
      return { simulatedFallback: true, message: err.message };
    }
  }

  if (PROVIDER === 'safaricom') {
    // Safaricom Daraja style STK Push
    try {
      const token = await getOAuthToken();
      const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0,14);
      const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
      const payload = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: CALLBACK_URL,
        AccountReference: accountReference || transactionId,
        TransactionDesc: description || `Payment ${transactionId}`
      };
      const url = `${API_URL.replace(/\/$/, '')}/mpesa/stkpush/v1/processrequest`;
      const resp = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 });
      return resp.data;
    } catch (err) {
      console.warn('Safaricom STK Push failed:', err.message);
      return { simulatedFallback: true, message: err.message };
    }
  }

  throw new Error('Unsupported MPESA_PROVIDER');
}

/**
 * Validate and normalize callback from provider into {CheckoutRequestID, MerchantRequestID, ResultCode, ResultDesc, Amount, PhoneNumber}
 */
function validateMpesaCallback(body) {
  // Try to handle common STK/callback shapes (safaricom style)
  try {
    if (body.Body && body.Body.stkCallback) {
      const cb = body.Body.stkCallback;
      const items = (cb.CallbackMetadata && cb.CallbackMetadata.Item) || [];
      const amount = items.find(i => i.Name === 'Amount')?.Value || null;
      const phone = items.find(i => i.Name === 'PhoneNumber')?.Value || null;
      return {
        CheckoutRequestID: cb.CheckoutRequestID,
        MerchantRequestID: cb.MerchantRequestID,
        ResultCode: cb.ResultCode,
        ResultDesc: cb.ResultDesc,
        Amount: amount,
        PhoneNumber: phone,
        raw: body
      };
    }
  } catch (e) { /* ignore */ }

  // Vodacom MZ callback shapes may differ; if provider sends raw fields, return as-is
  return body;
}

module.exports = { initMpesaPayment, validateMpesaCallback };