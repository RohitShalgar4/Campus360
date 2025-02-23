// controllers/studentviolationcontroller.js
import Violation from '../models/studentviolationModel.js';

export const getAllViolations = async (req, res) => {
  try {
    const violations = await Violation.find().sort({ date: -1 });
    res.status(200).json(violations);
  } catch (error) {
    console.error('Error fetching violations:', error);
    res.status(500).json({ 
      message: 'Error fetching violations', 
      error: error.message 
    });
  }
};

export const createViolation = async (req, res) => {
  try {
    const { date, studentName, reason, punishment } = req.body;
    
    const newViolation = new Violation({
      date,
      studentName,
      reason,
      punishment
    });
    
    const savedViolation = await newViolation.save();
    res.status(201).json(savedViolation);
  } catch (error) {
    console.error('Error creating violation:', error);
    res.status(500).json({ 
      message: 'Error creating violation', 
      error: error.message 
    });
  }
};