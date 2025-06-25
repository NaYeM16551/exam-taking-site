const Question = require('../models/questions');
const Exam = require('../models/exams');
const { createQuestions } = require('../controllers/questions');

const createExamWithQuestions = async (req, res) => {
  try {
    const {
      courseID,
      duration,
      title,
      totalMarks,
      strictTime,
      startTime,
      endTime,
      negativePercentage,
      resultPublishTime,
      subjects,
      examType,
      isSectioned,
      retryLimit,
      totalQuestions,
      retakeCount,
      state,
      questions,
    } = req.body;

    // Validate input
    if (!courseID || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "CourseID and at least one question are required." });
    }

    // Store questions and get the IDs
    const questionIDs = await createQuestions(questions);

    // Create a new exam
    const exam = new Exam({
      courseID,
      duration,
      title,
      totalMarks,
      strictTime,
      startTime,
      endTime,
      negativePercentage,
      resultPublishTime,
      subjects,
      examType,
      isSectioned,
      retryLimit,
      totalQuestions,
      retakeCount,
      state,
      mcqIDs: questionIDs, // Store the questionIDs into the mcqIDs field in the Exam schema
    });

    const savedExam = await exam.save(); // Save the exam in the DB

    // Respond with the saved exam
    res
      .status(201)
      .json({
        message: "Exam and questions saved successfully",
        exam: savedExam,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
