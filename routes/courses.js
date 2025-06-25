const express = require('express');
const authenticateUser = require('../middleware/authentication');
const { getAllCourses, getCourseByID, addCourse,addCourseToParticularUser, getCoursesOfAParticularUser } = require('../controllers/courses');
const router = express.Router();

router.route('/all-courses').get(getAllCourses);
router.route('/register-course').post(addCourseToParticularUser);
router.route('/my-courses').get(authenticateUser,getCoursesOfAParticularUser)

//the folwoing route is to add course from  Admin side
router.route('/add-course').post(addCourse);

router.route('/course/:id').get(getCourseByID);


module.exports =router;