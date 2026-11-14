const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');
const asyncHandler = require('./asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  const header = req.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Sign in to continue (Bearer token required).' });
  }

  let decoded;
  try {
    decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token. Sign in again.' });
  }
  if (!decoded.jti || !mongoose.isValidObjectId(decoded.sub)) {
    return res.status(401).json({ error: 'Invalid token payload' });
  }
  if (await RevokedToken.exists({ jti: decoded.jti })) {
    return res.status(401).json({ error: 'Token has been signed out' });
  }

  // Always use the role currently in MongoDB, not a role supplied by the browser.
  const user = await User.findById(decoded.sub);
  if (!user) return res.status(401).json({ error: 'Account no longer exists' });
  req.auth = decoded;
  req.user = user;
  next();
});

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authenticate, requireRole };
