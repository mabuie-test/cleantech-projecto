
const express = require('express');
const auth = require('../middlewares/authMiddleware');
const { initMpesa, mpesaCallback } = require('../controllers/paymentController');

const router = express.Router();

router.post('/mpesa/init', auth, initMpesa);
router.post('/mpesa/callback', express.json({ type: '*/*' }), mpesaCallback);

module.exports = router;
