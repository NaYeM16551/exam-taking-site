const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for Options
const OptionSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Please provide option text'],
  },
});

// Schema for Questions
const QuestionSchema = new Schema({
  questionText: {
    type: String, // HTML content
    required: [true, 'Please provide the question text'],
  },
  points: {
    type: mongoose.Types.Decimal128, // Decimal for the points
    default: 1,
  },
  explanation: {
    type: String, // HTML content for explanation
    default: null, // Optional explanation
  },
  subject: {
    type: String,
    required: [true, 'Please provide the subject'],
  },
  chapter: {
    type: String,
    required: [true, 'Please provide the chapter'],
  },
  topic: {
    type: String,
    required: [true, 'Please provide the topic'],
  },
  options: [OptionSchema], // Array of options
  correctAnswerIDs: [
    {
      type: mongoose.Schema.Types.ObjectId, // Foreign Key to Options
      ref: 'Option',
    },
  ],
});

module.exports = mongoose.model('Question', QuestionSchema);
