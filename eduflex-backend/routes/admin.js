const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// Admin creates user (can create admin, teacher, student)
router.post('/create-user', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        if (!['admin','teacher','student'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        // Return user info without password
        res.status(201).json({ 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
