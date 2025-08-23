

const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const { calculatePrice } = require('../utils/calcPrice');
const { getIO } = require('../socket');

async function createOrder(req, res, next) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, quantityKg, address, lat, lng, distanceKm } = req.body;
    const price = calculatePrice(type, Number(quantityKg || 0), Number(distanceKm || 0));

    const order = new Order({
      clientId: user._id,
      type,
      quantityKg: Number(quantityKg || 0),
      address,
      lat: Number(lat || 0),
      lng: Number(lng || 0),
      distanceKm: Number(distanceKm || 0),
      price
    });
    await order.save();

    try { getIO().emit('new_order', { order: { id: order._id, type: order.type, price: order.price, lat: order.lat, lng: order.lng, address: order.address } }); } catch (e) { console.warn('Socket emit failed', e.message); }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function getClientOrders(req, res, next) {
  try {
    const user = req.user;
    const orders = await Order.find({ clientId: user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getClientOrders };