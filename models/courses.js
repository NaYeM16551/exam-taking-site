const mongoose = require("mongoose");

const courseInstructor = new mongoose.Schema({
    name :
    {
        type : 'string',
        required : [true, "Please provide the instructor's name"],
    },
    details : 
    {
        type: 'string',
        default : null,
    }

})

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  validity: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["flat", "percentage"], // Ensures the value is either 'flat' or 'percentage'
    required: true,
  },
  discount: {
    type: mongoose.Types.Decimal128, // Using Decimal128 for precise decimal values
    required: true,
  },
});

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the course name"],
  },
  instructor: {
    type: [courseInstructor], // Array of strings
    required: [true, "Please provide the instructor"],
  },
  cover: {
    type: String, // URL as a string
    //required: [true, 'Please provide the cover image URL'],
  },
  price: {
    type: mongoose.Types.Decimal128, // Using Decimal128 for precise decimal values
    required: [true, "Please provide the price"],
  },
  totalClassCount: {
    type: Number, // Integer
    default: 0,
  },
  isPaid: {
    type: Boolean,
    required: [true, "Please specify if the course is paid"],
  },
  coupon: {
    type: CouponSchema, // Embedding the CouponSchema
    default: null, // Default to null if no coupon is provided
  },
  enrollCount: {
    type: Number, // Integer
    default: 0, // Default to 0
  },
  totalExamCount: {
    type: Number, // Integer
    default: 0, // Default to 0
  },
});

module.exports = mongoose.model("Course", CourseSchema);
