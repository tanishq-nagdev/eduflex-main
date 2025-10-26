const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware.js');
const { createUser } = require('../controllers/adminController.js');

// All routes in this file are for admins only
router.use(authenticate);
router.use(authorize('admin'));

// Admin creates user
router.post('/create-user', createUser);

module.exports = router;