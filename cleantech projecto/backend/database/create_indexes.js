// backend/database/create_indexes.js
// Usage: node database/create_indexes.js

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleantech';

async function connect() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('🗄️  Connected to MongoDB for index creation:', MONGO);
}

async function createIndexes() {
  // Users: unique phone index
  await User.collection.createIndex({ phone: 1 }, { unique: true, background: true });
  console.log('🔎 Created index: users.phone unique');

  // Orders: index on status and createdAt for queries
  await Order.collection.createIndex({ status: 1, createdAt: -1 }, { background: true });
  console.log('🔎 Created index: orders.status + createdAt');

  // Orders: geospatial index (if you use `location` GeoJSON field)
  // If you do not have location field, you may first run migrate_add_location.js
  try {
    await Order.collection.createIndex({ location: '2dsphere' }, { background: true });
    console.log('🗺️  Created geospatial index: orders.location 2dsphere');
  } catch (e) {
    console.warn('⚠️  Could not create 2dsphere index: ', e.message);
  }

  // Transactions: index on mpesa ids and status
  await Transaction.collection.createIndex({ mpesaCheckoutRequestId: 1 }, { background: true });
  await Transaction.collection.createIndex({ mpesaMerchantRequestId: 1 }, { background: true });
  await Transaction.collection.createIndex({ status: 1 }, { background: true });
  console.log('🔎 Created indexes on transactions (mpesa ids, status)');
}

async function run() {
  try {
    await connect();
    await createIndexes();
    await mongoose.disconnect();
    console.log('✅ Index creation completed');
    process.exit(0);
  } catch (err) {
    console.error('Index creation error:', err);
    process.exit(1);
  }
}

run();