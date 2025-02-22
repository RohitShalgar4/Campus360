import mongoose from "mongoose";

const facilityModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  requirements: [
    {
      id: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["text", "number", "file"],
        required: true,
      },
      required: {
        type: Boolean,
        default: true,
      },
      max: {
        type: Number,
      },
    },
  ],
  availability: [
    {
      date: {
        type: String,
        required: true,
      },
      slots: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

export const Facility = mongoose.model("Facility", facilityModel);