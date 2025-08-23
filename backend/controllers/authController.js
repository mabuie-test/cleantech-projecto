const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const SALT_ROUNDS = 10;

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, phone, password, role } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ error: 'Phone already registered' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ name, phone, passwordHash, role: role || 'client' });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '7d' });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role, rating: user.rating, verified: user.verified } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '7d' });
    res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role, rating: user.rating, verified: user.verified } });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };