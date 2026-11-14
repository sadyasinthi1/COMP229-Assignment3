const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const getAll = asyncHandler(async (_req, res) => res.json(await User.find().sort({ _id: -1 })));

const getById = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'You can only view your own profile' });
  }
  const user = await User.findById(req.params.id);
  return user ? res.json(user) : res.status(404).json({ error: 'Not found' });
});

async function createWithRole(req, res, role) {
  const { name, email, password } = req.body;
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password needs at least 8 characters' });
  }
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const user = await User.create({ name, email, role, password: await bcrypt.hash(password, 10) });
  return res.status(201).json(user);
}

const create = asyncHandler(async (req, res) => createWithRole(req, res, 'user'));
const createByAdmin = asyncHandler(async (req, res) => {
  const role = req.body.role === 'admin' ? 'admin' : 'user';
  return createWithRole(req, res, role);
});

const update = asyncHandler(async (req, res) => {
  const changes = {};
  for (const field of ['name', 'email']) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) changes[field] = req.body[field];
  }
  if (req.body.role !== undefined) {
    if (!['admin', 'user'].includes(req.body.role)) {
      return res.status(400).json({ error: 'Role must be admin or user' });
    }
    changes.role = req.body.role;
  }
  if (req.body.password) {
    if (typeof req.body.password !== 'string' || req.body.password.length < 8) {
      return res.status(400).json({ error: 'Password needs at least 8 characters' });
    }
    changes.password = await bcrypt.hash(req.body.password, 10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, changes,
    { new: true, runValidators: true });
  return user ? res.json(user) : res.status(404).json({ error: 'Not found' });
});

const deleteById = asyncHandler(async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ error: 'You cannot delete the admin account you are using' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  return user ? res.json({ message: 'Deleted', id: req.params.id })
    : res.status(404).json({ error: 'Not found' });
});

const deleteAll = asyncHandler(async (req, res) => {
  const result = await User.deleteMany({ _id: { $ne: req.user._id } });
  res.json({ message: 'Deleted all other users', deletedCount: result.deletedCount });
});

module.exports = { getAll, getById, create, createByAdmin, update, deleteById, deleteAll };
