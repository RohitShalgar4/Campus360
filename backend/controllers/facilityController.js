import { Facility } from '../models/facilityModel.js';
import mongoose from 'mongoose';

// Fetch all facilities
export const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({ status: 'active' });
    res.status(200).json(facilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new facility
export const addFacility = async (req, res) => {
  try {
    const { name, capacity, location, image, requirements, availability } = req.body;

    // Check if the facility already exists
    const existingFacility = await Facility.findOne({ name });
    if (existingFacility) {
      return res.status(400).json({ message: 'Facility with this name already exists' });
    }

    // Create a new facility
    const facility = new Facility({
      name,
      capacity,
      location,
      image,
      requirements,
      availability,
    });

    await facility.save();
    res.status(201).json({ message: 'Facility added successfully', facility });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a facility
export const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid facility ID' });
    }

    const updateData = req.body; // Data to update

    // Find and update the facility
    const updatedFacility = await Facility.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedFacility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.status(200).json({ message: 'Facility updated successfully', updatedFacility });
  } catch (error) {
    console.error('Update Facility Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a facility
export const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.status(200).json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};