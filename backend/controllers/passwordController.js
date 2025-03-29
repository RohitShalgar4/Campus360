import bcrypt from 'bcryptjs';
import { Student } from '../models/studentModel.js';
import { Admin } from '../models/adminModel.js';
import { Doctor } from '../models/doctorModel.js';

export const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const { id, role } = req;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password is required'
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        let user;
        let updatedUser;

        // Update password based on user role
        switch (role) {
            case 'student':
                user = await Student.findById(id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Student not found'
                    });
                }
                user.password = hashedPassword;
                user.isFirstLogin = false;
                updatedUser = await user.save();
                break;

            case 'admin':
                user = await Admin.findById(id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Admin not found'
                    });
                }
                user.password = hashedPassword;
                user.isFirstLogin = false;
                updatedUser = await user.save();
                break;

            case 'doctor':
                user = await Doctor.findById(id);
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'Doctor not found'
                    });
                }
                user.password = hashedPassword;
                user.isFirstLogin = false;
                updatedUser = await user.save();
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user role'
                });
        }

        // Remove password from response
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password'
        });
    }
}; 