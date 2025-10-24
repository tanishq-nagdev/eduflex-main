const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Submit assignment
const submitAssignment = async (req, res) => {
  const { assignmentId, submissionLink } = req.body;

  const submission = await Submission.create({
    student: req.user._id,
    assignment: assignmentId,
    submissionLink
  });

  res.status(201).json(submission);
};

// Get all assignments for student
const getAssignments = async (req, res) => {
  const assignments = await Assignment.find().populate('course');
  res.json(assignments);
};

module.exports = { submitAssignment, getAssignments };
