// backend/database/seed.js
// Node script to seed initial data for CleanTech backend.
// Usage: from backend/ run: node database/seed.js
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

const SALT_ROUNDS = 10;
const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleantech';

async function connect() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('🗄️  Connected to MongoDB for seeding:', MONGO);
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Order.deleteMany({}),
    Transaction.deleteMany({})
  ]);
  console.log('🧹 Cleared collections: users, orders, transactions');
}

async function createUsers() {
  const users = [];

  // Admin (optional)
  const adminPass = await bcrypt.hash('admin1234', SALT_ROUNDS);
  users.push(new User({
    name: 'Admin CleanTech',
    phone: '+258840000001',
    passwordHash: adminPass,
    role: 'admin',
    verified: true
  }));

  // Client
  const clientPass = await bcrypt.hash('client123', SALT_ROUNDS);
  users.push(new User({
    name: 'Cliente Demo',
    phone: '+258840000002',
    passwordHash: clientPass,
    role: 'client',
    verified: true
  }));

  // Collector 1
  const col1Pass = await bcrypt.hash('collector123', SALT_ROUNDS);
  users.push(new User({
    name: 'Recolhedor A',
    phone: '+258840000003',
    passwordHash: col1Pass,
    role: 'collector',
    verified: true
  }));

  // Collector 2
  const col2Pass = await bcrypt.hash('collector123', SALT_ROUNDS);
  users.push(new User({
    name: 'Recolhedor B',
    phone: '+258840000004',
    passwordHash: col2Pass,
    role: 'collector',
    verified: false
  }));

  const created = await User.insertMany(users);
  console.log(`✅ Created ${created.length} users`);
  return created;
}

async function createOrders(users) {
  const client = users.find(u => u.role === 'client');
  const collector = users.find(u => u.role === 'collector');

  // Sample GeoJSON points (Maputo area approx)
  const orders = [
    new Order({
      clientId: client._id,
      collectorId: null,
      type: 'domestico',
      quantityKg: 20,
      address: 'Bairro A, Rua 1, Maputo',
      lat: -25.9655,
      lng: 32.5832,
      distanceKm: 1.5,
      price: 100 + 20 * 5, // matches calcPrice
      status: 'pending',
      meta: { notes: 'Sacos pretos' }
    }),
    new Order({
      clientId: client._id,
      collectorId: collector._id,
      type: 'reciclavel',
      quantityKg: 50,
      address: 'Bairro B, Rua 2, Maputo',
      lat: -25.9650,
      lng: 32.5732,
      distanceKm: 3.0,
      price: 80 + 50 * 3 + (3 - 2) * 8,
      status: 'in_progress',
      meta: { notes: 'Plástico e papel' }
    }),
    new Order({
      clientId: client._id,
      collectorId: null,
      type: 'entulho',
      quantityKg: 200,
      address: 'Bairro C, Rua 3, Matola',
      lat: -25.8369,
      lng: 32.5310,
      distanceKm: 8.0,
      price: 150 + 200 * 7 + (8 - 2) * 12,
      status: 'pending',
      meta: { notes: 'Tijolos e entulho de obra' }
    })
  ];

  const created = await Order.insertMany(orders);
  console.log(`✅ Created ${created.length} orders`);
  return created;
}

async function createTransactions(orders, users) {
  const tx = [
    new Transaction({
      orderId: orders[1]._id,
      amount: orders[1].price,
      phone: users.find(u => u.role === 'client').phone,
      mpesaMerchantRequestId: `MREQ_${Date.now()}`,
      mpesaCheckoutRequestId: `CREQ_${Date.now()}`,
      status: 'pending',
      raw: { simulated: true }
    }),
    new Transaction({
      orderId: orders[0]._id,
      amount: orders[0].price,
      phone: users.find(u => u.role === 'client').phone,
      status: 'paid',
      raw: { simulatedPaid: true }
    })
  ];
  const created = await Transaction.insertMany(tx);
  console.log(`✅ Created ${created.length} transactions`);
  return created;
}

async function run() {
  try {
    await connect();
    await clearCollections();
    const users = await createUsers();
    const orders = await createOrders(users);
    await createTransactions(orders, users);
    console.log('🎉 Seed completed successfully. Sample credentials:');
    console.log('  Admin: phone +258840000001 | pass admin1234');
    console.log('  Client: phone +258840000002 | pass client123');
    console.log('  Collector A: phone +258840000003 | pass collector123');
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

run();