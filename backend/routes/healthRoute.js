import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define a Student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  enrollmentNumber: { type: String, unique: true, required: true },
  dateOfBirth: Date,
  medicalCondition: String,
});

const Student = mongoose.model('Student', studentSchema);

// Search endpoint for students
router.get('/search', async (req, res) => {
  const { term } = req.query;

  // Validate input
  if (!term || typeof term !== 'string') {
    return res.status(400).json({ error: 'Search term is required and must be a string' });
  }

  try {
    // Search students by name or enrollment number (case-insensitive)
    const students = await Student.find({
      $or: [
        { name: { $regex: new RegExp(term, 'i') } },
        { enrollmentNumber: { $regex: new RegExp(term, 'i') } },
      ],
    }).select('name enrollmentNumber dateOfBirth medicalCondition'); // Limit returned fields

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health checkup submission endpoint
router.post('/health-checkup', async (req, res) => {
  const { studentId, symptoms, diagnosis, recommendations, leaveRequired } = req.body;

  try {
    // Save health checkup data to the database
    const healthRecord = new HealthRecord({
      studentId,
      symptoms,
      diagnosis,
      recommendations,
      leaveRequired,
    });

    await healthRecord.save();
    res.status(201).json({ message: 'Health checkup recorded successfully' });
  } catch (error) {
    console.error('Error submitting health checkup:', error);
    res.status(500).json({ error: 'Error submitting health checkup' });
  }
});

export default router;