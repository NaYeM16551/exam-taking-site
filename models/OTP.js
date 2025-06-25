const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP will automatically be deleted after 5 minutes (300 seconds)
    }
});

module.exports = mongoose.model('OTP', OTPSchema);
