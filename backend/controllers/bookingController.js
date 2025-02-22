import mongoose from 'mongoose';
import { Booking } from '../models/bookingModel.js';
import { Facility } from '../models/facilityModel.js';
import { Student } from '../models/studentModel.js';

// Create a booking request
export const createBooking = async (req, res) => {
  const { facilityId, date, slot, purpose, requirements } = req.body;

  try {
    // Debugging: Log the request body
    console.log("Request Body:", req.body);

    // Validate input
    if (!facilityId || !date || !slot || !purpose || !requirements || typeof requirements !== 'object') {
      return res.status(400).json({ message: 'All fields are required, and requirements must be an object' });
    }

    // Validate ObjectId fields
    if (!mongoose.Types.ObjectId.isValid(facilityId)) {
      return res.status(400).json({ message: 'Invalid facilityId' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: 'Invalid requestedBy (user ID)' });
    }

    // Check if the facility exists
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    // Check if the student exists
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the facility is available for the requested date and slot
    const availability = facility.availability.find(avail => avail.date === date);
    if (!availability || !availability.slots.includes(slot)) {
      return res.status(400).json({ message: 'Facility is not available for the requested date and slot' });
    }

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ facilityId, date, slot });
    if (existingBooking) {
      return res.status(400).json({ message: 'The selected slot is already booked' });
    }

    // Create the booking
    const booking = new Booking({
      facilityId: new mongoose.Types.ObjectId(facilityId), // Ensure facilityId is ObjectId
      date,
      slot,
      purpose,
      requestedBy: new mongoose.Types.ObjectId(req.user.id), // Ensure requestedBy is ObjectId
      requirements,
    });

    // Debugging: Log the booking object before saving
    console.log("Booking to be saved:", booking);

    await booking.save();

    // Debugging: Log the saved booking
    console.log("Booking saved successfully:", booking);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error); // Debugging: Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings for the authenticated student
export const getBookings = async (req, res) => {
  try {
    console.log("Authenticated User ID:", req.user.id); // Debugging: Log the user ID

    // Convert the user ID string to an ObjectId
    const requestedBy = new mongoose.Types.ObjectId(req.user.id);

    // Fetch bookings for the authenticated user and populate all referenced fields
    const bookings = await Booking.find({ requestedBy })
      .populate({
        path: 'facilityId', // Populate the facility details
        select: '-__v', // Exclude the __v field
      })
      .populate({
        path: 'requestedBy', // Populate the user who requested the booking
        select: '-password -__v', // Exclude sensitive fields like password
      });

    console.log("Bookings found:", bookings); // Debugging: Log the bookings

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error); // Debugging: Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or reject a booking (Admin-only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find and update the booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    ).populate({
      path: 'facilityId',
      select: 'name location capacity', // Include only necessary fields
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    console.error('Error updating booking status:', error); // Debugging: Log the error
    res.status(500).json({ message: 'Server error' });
  }
};