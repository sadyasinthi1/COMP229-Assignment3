const router = require('express').Router();
const controller = require('../controllers/projectController');
const { authenticate, requireRole } = require('../middleware/auth');
const adminOnly = [authenticate, requireRole('admin')];

router.route('/')
  .get(controller.getAll)
  .post(...adminOnly, controller.create)
  .delete(...adminOnly, controller.deleteAll);
router.route('/:id')
  .get(controller.getById)
  .put(...adminOnly, controller.update)
  .delete(...adminOnly, controller.deleteById);
module.exports = router;
