const Course = require('../models/Course');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin, Teacher)
const createCourse = async (req, res) => {
  const { title, description } = req.body;
  // If user is admin, they can assign a teacher. If user is teacher, they are the teacher.
  const teacher = req.user.role === 'teacher' ? req.user.id : req.body.teacher || req.user.id;
  
  const course = new Course({ title, description, teacher });
  await course.save();
  res.status(201).json(course);
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getAllCourses = async (req, res) => {
  const courses = await Course.find().populate('teacher', 'name email');
  res.json(courses);
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Admin, Teacher)
const enrollStudent = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const { studentId } = req.body;
  if (!studentId) return res.status(400).json({ message: 'studentId required' });
  
  if (!course.students.includes(studentId)) {
    course.students.push(studentId);
    await course.save();
  }
  res.json(course);
};

module.exports = {
  createCourse,
  getAllCourses,
  enrollStudent
};