const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware.js');
const {
  createCourse,
  getAllCourses,
  enrollStudent
} = require('../controllers/courseController.js');

// All routes here are protected by login
router.use(authenticate);

// create (teacher/admin)
router.post('/', authorize('teacher','admin'), createCourse);

// list all (any logged-in user)
router.get('/', getAllCourses);

// enroll a student (teacher or admin)
router.post('/:id/enroll', authorize('teacher','admin'), enrollStudent);

module.exports = router;