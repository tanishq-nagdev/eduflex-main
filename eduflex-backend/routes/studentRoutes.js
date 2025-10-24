const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const User = require('../models/User');

// =========================
// Student - Get my courses
// =========================
router.get('/courses', authenticate, authorize('student'), async (req, res) => {
    try {
        const courses = await Course.find({ students: req.user._id });
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// =========================
// Student - Get assignments for a course
// =========================
router.get('/assignments/:courseId', authenticate, authorize('student'), async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// =========================
// Student - Submit an assignment
// =========================
router.post('/assignments/:assignmentId/submit', authenticate, authorize('student'), async (req, res) => {
    try {
        const { submission } = req.body; // e.g., file URL or text
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // Check if student is enrolled in the course
        const course = await Course.findById(assignment.course);
        if (!course.students.includes(req.user._id)) return res.status(403).json({ message: 'Not enrolled in this course' });

        // Add or update submission
        const existingSubmissionIndex = assignment.submissions.findIndex(s => s.student.equals(req.user._id));
        if (existingSubmissionIndex !== -1) {
            assignment.submissions[existingSubmissionIndex].submission = submission;
        } else {
            assignment.submissions.push({ student: req.user._id, submission });
        }

        await assignment.save();
        res.json({ message: 'Submission saved', assignment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// =========================
// Student - View my grades
// =========================
router.get('/grades', authenticate, authorize('student'), async (req, res) => {
    try {
        const assignments = await Assignment.find({ 'submissions.student': req.user._id }).populate('course');
        const grades = assignments.map(a => {
            const sub = a.submissions.find(s => s.student.equals(req.user._id));
            return {
                assignmentId: a._id,
                assignmentTitle: a.title,
                course: a.course.name,
                grade: sub.grade || null
            };
        });
        res.json(grades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
