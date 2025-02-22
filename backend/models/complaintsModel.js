import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Academic",
      "Facilities",
      "Administrative",
      "Food Services",
      "Transportation",
      "Technology",
      "Other",
    ],
  },
  status: {
    type: String,
    required: true,
    enum: ["Under Review", "Investigating", "Resolved"],
    default: "Under Review",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  votes: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: null,
  },
});

// Create the model
const Complaint = mongoose.model("Complaint", complaintSchema);

// Export the model as default
export default Complaint;