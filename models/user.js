const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 20,
      default: 'lastName',
    },
    location: {
      type: String,
      trim: true,
      maxlength: 20,
      default: 'my city',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [/^\d{11}$/, 'Phone number must be exactly 11 digits'],
      unique: true,
    },
    guardianPhoneNumber: {
      type: String,
      required: [true, 'Please provide guardian\'s phone number'],
      match: [/^\d{11}$/, 'Guardian\'s phone number must be exactly 11 digits'],
    },
    hscYear: {
        type: Number,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    facebookID: {
        type: String,
        default: null  // Optional field
    },
    courseIDs: [
        {
            type: String,
            ref: 'Course'  // Assuming a Course model exists
        }
    ],
    importantQuestionIDs: [
        {
            type: String,
            ref: 'Question'  // Assuming a Question model exists
        }
    ],
    currentSessionID: {
        type: String,
        default: null
    }
  });

  
  UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    );
  };
  
  UserSchema.methods.comparePassword = async function (canditatePassword) {
    console.log(this.password);
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
  }
  
  module.exports = mongoose.model('User', UserSchema);