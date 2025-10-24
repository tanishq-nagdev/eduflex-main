const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks: Number,
  feedback: String,
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // teacher or admin
  gradedAt: Date
});

module.exports = mongoose.model('Grade', gradeSchema);
