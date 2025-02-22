import Complaint from '../models/complaintsModel.js';

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ votes: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints", error });
  }
};

// Add a new complaint
const addComplaint = async (req, res) => {
  try {
    const { title, description, category, imageUrl } = req.body;
    const newComplaint = new Complaint({
      title,
      description,
      category,
      imageUrl,
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: "Error adding complaint", error });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Upvote a complaint
const upvoteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.votes += 1;
    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Error upvoting complaint", error });
  }
};

// Delete a complaint
const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComplaint = await Complaint.findByIdAndDelete(id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting complaint", error });
  }
};

export {
  getAllComplaints,
  addComplaint,
  updateComplaintStatus,
  upvoteComplaint,
  deleteComplaint,
};