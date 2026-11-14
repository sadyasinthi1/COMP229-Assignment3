const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { signin, signout, profile } = require('../controllers/authController');

router.post('/signin', signin);
// The course asks for GET /auth/signout; POST also remains for clients that
// prefer a state-changing signout request using POST.
router.get('/signout', authenticate, signout);
router.post('/signout', authenticate, signout);
router.get('/profile', authenticate, profile);
module.exports = router;
