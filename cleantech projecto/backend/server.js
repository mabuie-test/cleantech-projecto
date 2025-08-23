
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const dbConnect = require('./config/db');
const { initSocket } = require('./socket');
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const paymentsRoutes = require('./routes/payments');
const { errorHandler } = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 4000;
const app = express();

// JSON parsing; allow raw for certain callbacks
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payments', paymentsRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.ENV || 'dev' }));

app.use(errorHandler);

(async () => {
  try {
    await dbConnect();
    const server = http.createServer(app);
    initSocket(server, { cors: { origin: process.env.FRONTEND_ORIGIN || '*' } });

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();
