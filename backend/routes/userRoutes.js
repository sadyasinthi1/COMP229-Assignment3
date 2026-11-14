const router = require('express').Router();
const controller = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');
const adminOnly = [authenticate, requireRole('admin')];

// User registration: every public signup is ALWAYS a regular user.
router.post('/', controller.create);
router.post('/admin', ...adminOnly, controller.createByAdmin);
router.get('/', ...adminOnly, controller.getAll);
router.delete('/', ...adminOnly, controller.deleteAll);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', ...adminOnly, controller.update);
router.delete('/:id', ...adminOnly, controller.deleteById);
module.exports = router;
