const router = require('express').Router();
const {
  register, login, refresh, logout, adminRefresh, adminLogout, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/admin-refresh', adminRefresh);
router.post('/admin-logout', adminLogout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
