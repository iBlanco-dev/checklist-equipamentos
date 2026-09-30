const express = require('express');
const { login, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { requireAdmin } = require('../middlewares/auth');

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', requireAdmin, changePassword);

module.exports = router;
