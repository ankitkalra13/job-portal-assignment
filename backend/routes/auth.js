const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-token', authController.verifyEmailToken);
router.post('/verify-user-authorization', authController.verifyHeaderToken);
router.post('/logout',authController.logout);

module.exports = router;