const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const Course = require("../models/courses");
const User = require("../models/user");

//fetch all the available courses
const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  //send all courses
  res.status(StatusCodes.OK).json({
    msg: "All courses found successful",
    data: courses,
  });
};

//this method will add course from admin side
const addCourse = async (req, res) => {
  const newCourse = new Course(req.body); // Create a new course instance with data from the request body
  const savedCourse = await newCourse.save();
  res.status(201).json({ success: true, data: savedCourse });
};

//get a particular course by its ID
const getCourseByID = async (req, res) => {
  const { id } = req.params;

  //fetch course detail by id
  const course = await Course.findById(id);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }

  res.status(200).json({ success: true, data: course });
};

//adding course to a user student
const addCourseToParticularUser = async (req, res) => {
  const { userId, courseId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }

  // Add the course ID to the user's courseIDs array if it's not already included
  if (!user.courseIDs.includes(courseId)) {
    user.courseIDs.push(courseId);
    await user.save();
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Course already enrolled" });
  }

  res.status(200).json({ success: true, data: user });
};

//get all courses of a particular user
const getCoursesOfAParticularUser = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  // If no user found, return a 404 error
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Find the courses that match the courseIDs in the user's courseIDs array
  const courses = await Course.find({ _id: { $in: user.courseIDs } });

  res.status(200).json({ success: true, data: courses });
};


module.exports = {
  getAllCourses,
  getCourseByID,
  addCourse,
  addCourseToParticularUser,
  getCoursesOfAParticularUser,
};
