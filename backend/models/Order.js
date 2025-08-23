
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { type: String, enum: ['domestico','reciclavel','entulho','especial'], required: true },
  quantityKg: { type: Number, default: 0 },
  address: { type: String, required: true },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 },
  distanceKm: { type: Number, default: 0 },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending','assigned','in_progress','completed','cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  meta: { type: Object, default: {} }
});

module.exports = mongoose.model('Order', orderSchema);