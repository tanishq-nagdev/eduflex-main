const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { authenticate, authorize } = require('../middleware/auth');

// create (teacher/admin)
router.post('/', authenticate, authorize('teacher','admin'), async (req, res) => {
  const { title, description } = req.body;
  const teacher = req.user.role === 'teacher' ? req.user._id : req.body.teacher || req.user._id;
  const course = new Course({ title, description, teacher });
  await course.save();
  res.status(201).json(course);
});

// list all
router.get('/', authenticate, async (req, res) => {
  const courses = await Course.find().populate('teacher', 'name email');
  res.json(courses);
});

// enroll a student (teacher or admin)
router.post('/:id/enroll', authenticate, authorize('teacher','admin'), async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ message: 'studentId required' });
  if (!course.students.includes(studentId)) {
    course.students.push(studentId);
    await course.save();
  }
  res.json(course);
});

module.exports = router;
