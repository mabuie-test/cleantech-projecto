
// backend/database/migrate_add_location.js
// Usage: node database/migrate_add_location.js

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Order = require('../models/Order');

const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/cleantech';

async function connect() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('🗄️  Connected to MongoDB for migration:', MONGO);
}

async function migrate() {
  const cursor = Order.find({ $or: [ { location: { $exists: false } }, { location: null } ] }).cursor();
  let count = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const lat = Number(doc.lat || 0);
    const lng = Number(doc.lng || 0);
    if (!isNaN(lat) && !isNaN(lng)) {
      doc.location = { type: 'Point', coordinates: [lng, lat] };
      await doc.save();
      count++;
    }
  }
  console.log(`🔁 Migration complete. Updated ${count} orders with location`);
}

async function run() {
  try {
    await connect();
    await migrate();
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();