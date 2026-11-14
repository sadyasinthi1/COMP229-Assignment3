const router = require('express').Router();
const ContactMessage = require('../models/ContactMessage');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const adminOnly = [authenticate, requireRole('admin')];

// Visitors submit a Contact form, not CRUD records. No visitor can edit or delete Contact records.
router.post('/', asyncHandler(async (req, res) => {
  const { firstname, lastname, email, contactNumber, message } = req.body;
  const saved = await ContactMessage.create({ firstname, lastname, email, contactNumber, message });
  res.status(201).json({ message: 'Contact message saved', id: saved._id });
}));
router.get('/', ...adminOnly, asyncHandler(async (_req, res) => {
  res.json(await ContactMessage.find().sort({ _id: -1 }));
}));
router.delete('/:id', ...adminOnly, asyncHandler(async (req, res) => {
  const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
  return deleted ? res.json({ message: 'Deleted' }) : res.status(404).json({ error: 'Not found' });
}));
module.exports = router;
