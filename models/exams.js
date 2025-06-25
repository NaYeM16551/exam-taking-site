const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId, // Foreign Key to Courses
    ref: "Course",
    required: [true, "Please provide the course ID"],
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title for the exam"],
  },
  totalMarks: {
    type: Number,
  },
  strictTime: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  negativePercentage: {
    type: mongoose.Types.Decimal128, // Negative marking percentage
    default: 0,
  },
  resultPublishTime: {
    type: Date,
    required: true,
  },
  subjects: {
    type: [String], // List of subjects
  },
  examType: {
    type: String,
    enum: ["practice", "live"], // Only 'practice' or 'live' allowed
    required: true,
  },
  isSectioned: {
    type: Boolean,
    default: false, // Is the exam sectioned?
  },
  retryLimit: {
    type: Number,
    default: 0, // Retry limit for the exam
  },
  totalQuestions: {
    type: Number,
    required: true, // Total number of questions in the exam
  },
  retakeCount: {
    type: Number,
    default: 0, // Number of retakes a user has done
  },
  state: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "absent"],
    default: "not_started",
  },
  mcqIDs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question", // Foreign key to Questions
    },
  ],
});

module.exports = mongoose.model("Exam", ExamSchema);
