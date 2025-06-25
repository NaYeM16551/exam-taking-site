const express = require('express');
const router = express.Router();
const {login,register}=require('../controllers/auth');
const { sendOTP, verifyOTP, resetPassword } = require('../controllers/OTP');

router.route('/login').get(login);
router.route('/register').post(register);
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);
router.route('/reset-password').post(resetPassword)

module.exports = router;
