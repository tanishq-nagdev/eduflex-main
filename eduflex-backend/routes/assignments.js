const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware.js');
const {
  createAssignment,
  getAssignmentsForCourse,
  updateAssignment
} = require('../controllers/assignmentController.js');

// All routes here are protected by login
router.use(authenticate);

// create assignment (teacher only)
router.post('/:courseId', authorize('teacher'), createAssignment);

// update assignment (teacher only)
router.patch('/', authorize('teacher'), updateAssignment);

// list assignments for a course
router.get('/:courseId', getAssignmentsForCourse);

module.exports = router;