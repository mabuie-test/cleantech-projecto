const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/authMiddleware');
const { createOrder, getClientOrders } = require('../controllers/orderController');
const router = express.Router();

router.post('/', auth, [
  body('type').isIn(['domestico','reciclavel','entulho','especial']),
  body('quantityKg').isNumeric(),
  body('address').isString().notEmpty(),
  body('distanceKm').isNumeric()
], createOrder);

router.get('/client/:clientId', auth, getClientOrders);

module.exports = router;