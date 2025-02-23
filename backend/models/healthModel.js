const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
});

const healthRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, default: Date.now },
  symptoms: String,
  diagnosis: String,
  recommendations: String,
  leaveRequired: { type: Boolean, default: false },
  leaveGranted: { type: Boolean, default: false },
});

const Student = mongoose.model('Student', studentSchema);
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = { Student, HealthRecord };