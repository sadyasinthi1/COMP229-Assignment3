require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/models/User');

async function main() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  if (!MONGODB_URI || !JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('Set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD in .env');
  }
  if (ADMIN_PASSWORD.length < 8 || ADMIN_PASSWORD.includes('CHANGE_THIS')) {
    throw new Error('Replace ADMIN_PASSWORD placeholder in .env with your own strong password');
  }
  await mongoose.connect(MONGODB_URI, { dbName: 'Portfolio', serverSelectionTimeoutMS: 10000 });
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { name: 'Portfolio Administrator', email, password, role: 'admin' } },
    { upsert: true, new: true, runValidators: true }
  );
  console.log('Admin ready in MongoDB:', admin.email, '| role:', admin.role);
}

main().catch(err => { console.error(err.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
