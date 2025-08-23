const mongoose = require('mongoose');

const trxSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  amount: { type: Number, required: true },
  phone: { type: String, required: true },
  mpesaMerchantRequestId: { type: String },
  mpesaCheckoutRequestId: { type: String },
  status: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  raw: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', trxSchema);