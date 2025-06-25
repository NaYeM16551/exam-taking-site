const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const OTP = require('../models/OTP');
const User = require("../models/user");

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

const sendOTPEmail = async (email, otp) => {
    console.log(process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        port: 587,
        secureConnection: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

const saveOTP = async (userId, otp) => {
    await OTP.findOneAndUpdate(
        { userId }, // Search for an existing entry with the same userId
        { otp, createdAt: new Date() }, // Update the OTP and reset the createdAt timestamp
        { upsert: true, new: true } // If not found, create a new entry; return the updated document
    );
};



const sendOTP= async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }



    const otp = generateOTP();
    await sendOTPEmail(email, otp);
    await saveOTP(user._id, otp);

    res.status(200).json({ msg: 'OTP sent' });
};


const verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;

    const storedOtp = await OTP.findOne({ userId, otp });
    if (!storedOtp) {
        return res.status(400).json({ msg: 'Invalid OTP' });
    }

    res.status(200).json({ msg: 'OTP verified', redirectUrl: '/reset-password' }); // Redirect to reset password page
}

const resetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ msg: 'Password updated successfully' });
}



module.exports = { sendOTP,verifyOTP,resetPassword, };