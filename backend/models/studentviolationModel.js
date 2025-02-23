// models/studentviolationmodel.js
import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  punishment: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Violation', violationSchema);