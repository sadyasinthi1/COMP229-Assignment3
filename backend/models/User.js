const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user', required: true }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  toJSON: { transform: (_doc, ret) => { delete ret.password; return ret; } }
});

module.exports = mongoose.model('User', schema, 'users');
