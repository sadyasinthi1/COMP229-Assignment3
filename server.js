require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./backend/app');

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('ERROR: MONGODB_URI missing. Copy .env.example to .env and edit it.');
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('REPLACE_WITH')) {
  console.error('ERROR: Set JWT_SECRET in .env (at least 32 characters).');
  process.exit(1);
}

mongoose.connect(mongoUri, { dbName: 'Portfolio', serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log('MongoDB connected: Portfolio');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
