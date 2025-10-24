const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { authenticate, authorize } = require('../middleware/auth');

// create assignment (teacher only)
router.post('/', authenticate, authorize('teacher'), async (req, res) => {
  const { title, description, courseId, dueDate } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // ensure teacher owns course or admin rights (teacher only can create for own course)
  if (req.user.role === 'teacher' && String(course.teacher) !== String(req.user._id)) {
    return res.status(403).json({ message: 'You can only create assignments for your own courses' });
  }

  const assignment = new Assignment({
    title, description, course: courseId, dueDate, createdBy: req.user._id
  });
  await assignment.save();
  res.status(201).json(assignment);
});

// list assignments for a course
router.get('/course/:courseId', authenticate, async (req, res) => {
  const list = await Assignment.find({ course: req.params.courseId });
  res.json(list);
});

module.exports = router;
