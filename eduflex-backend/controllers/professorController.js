const Course = require('../models/Course');
const Assignment = require('../models/Assignment');

// Create course
const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.create({
    title,
    description,
    professor: req.user._id
  });
  res.status(201).json(course);
};

// Create assignment
const createAssignment = async (req, res) => {
  const { title, description, courseId, dueDate } = req.body;
  const assignment = await Assignment.create({
    title,
    description,
    course: courseId,
    professor: req.user._id,
    dueDate
  });
  res.status(201).json(assignment);
};

module.exports = { createCourse, createAssignment };
