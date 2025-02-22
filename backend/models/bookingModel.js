import mongoose from "mongoose";

const bookingModel = new mongoose.Schema({
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  requirements: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export const Booking = mongoose.model("Booking", bookingModel);