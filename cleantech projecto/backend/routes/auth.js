
const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', [
  body('name').isLength({ min: 1 }),
  body('phone').isLength({ min: 6 }),
  body('password').isLength({ min: 6 })
], register);

router.post('/login', [
  body('phone').exists(),
  body('password').exists()
], login);

module.exports = router;