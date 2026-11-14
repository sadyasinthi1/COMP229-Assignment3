const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
const asyncHandler = require('../middleware/asyncHandler');

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await bcrypt.compare(String(password), user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ sub: user._id.toString(), jti: crypto.randomUUID() },
    process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, tokenType: 'Bearer', user: user.toJSON() });
});

const signout = asyncHandler(async (req, res) => {
  await RevokedToken.updateOne({ jti: req.auth.jti },
    { $setOnInsert: { jti: req.auth.jti, expiresAt: new Date(req.auth.exp * 1000) } },
    { upsert: true });
  res.json({ message: 'Signed out. Token revoked.' });
});

const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth.sub);
  return user ? res.json(user) : res.status(401).json({ error: 'User no longer exists' });
});
module.exports = { signin, signout, profile };
