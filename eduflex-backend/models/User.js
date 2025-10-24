// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['student','teacher','admin'], required: true },
  password: { type: String, required: true },
  studentId: { type: String },
  joinedAt: { type: Date, default: Date.now },

  // stats for UI
  enrolledCoursesCount: { type: Number, default: 0 },
  pendingAssignmentsCount: { type: Number, default: 0 },
  averageGrade: { type: Number, default: 0 },
  overallProgressPct: { type: Number, default: 0 },

  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
