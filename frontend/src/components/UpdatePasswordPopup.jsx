import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import Portal from './Portal';

const UpdatePasswordPopup = ({ onClose }) => {
    useEffect(() => {
        console.log('UpdatePasswordPopup mounted');
        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
        // Force a reflow to ensure the popup is visible
        document.body.offsetHeight;
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const updateUser = useAuthStore((state) => state.updateUser);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        setError('');
    };

    const validatePasswords = () => {
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords before submitting
        if (!validatePasswords()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/password/update-password',
                { newPassword: formData.newPassword },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                // Update the auth store with the updated user data
                updateUser({
                    ...response.data.user,
                    isFirstLogin: false
                });
                toast.success('Password updated successfully');
                onClose();
            } else {
                setError(response.data.message || 'Failed to update password');
                toast.error(response.data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Password update error:', error);
            setError(error.response?.data?.message || 'Error updating password');
            toast.error(error.response?.data?.message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Portal>
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
                <div 
                    className="bg-white rounded-lg p-8 max-w-md w-full relative shadow-xl mx-4"
                    style={{ position: 'relative', zIndex: 10000 }}
                >
                    <h2 className="text-2xl font-bold mb-6">Update Your Password</h2>
                    <p className="mb-6 text-gray-600">
                        This appears to be your first login. Please update your password to continue.
                    </p>
                    
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                minLength={6}
                                placeholder="Enter new password (min. 6 characters)"
                                autoFocus
                            />
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                minLength={6}
                                placeholder="Confirm your new password"
                            />
                        </div>
                        
                        <div className="flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Portal>
    );
};

UpdatePasswordPopup.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default UpdatePasswordPopup; 