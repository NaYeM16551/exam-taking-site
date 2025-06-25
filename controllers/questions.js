const { BadRequestError, UnauthenticatedError } = require("../errors");
const Question = require('../models/questions')


// Service function to create questions and return their IDs
const createQuestions = async (questions) => {
  const questionIDs = [];

  for (const questionData of questions) {
    // Save the options first
    const savedOptions = questionData.options.map((optionText) => ({
      text: optionText,
    }));

    // Create the question
    const question = new Question({
      questionText: questionData.questionText,
      points: questionData.points || 1,
      explanation: questionData.explanation,
      subject: questionData.subject,
      chapter: questionData.chapter,
      topic: questionData.topic,
      options: savedOptions, // Save options in the question
    });

    // Save the question in the DB
    const savedQuestion = await question.save();

    // Match correct answer text to the option's ObjectId and update correctAnswerIDs
    const correctAnswerIDs = savedQuestion.options
      .filter(option => questionData.correctAnswers.includes(option.text))
      .map(option => option._id);

    // Update question with correctAnswerIDs
    savedQuestion.correctAnswerIDs = correctAnswerIDs;
    await savedQuestion.save();

    // Collect the questionID
    questionIDs.push(savedQuestion._id);
  }

  return questionIDs;
};

module.exports = { createQuestions };
