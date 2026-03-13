import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminForgotPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('forgot'); // 'forgot' or 'reset'

    // Step 1: Check if token is present in the URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            setStep('reset');
        }
    }, [location.search]);


    // Step 2: Handle forgot password form
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formData = new URLSearchParams();
            formData.append("email", email);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/Authentication/forgot_password`,
                formData,
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );

            setMessage(response.data.message || "Reset link sent to your email.");
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error: Unable to send reset link');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Handle reset password form
    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage('Invalid or missing token.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const formData = new URLSearchParams();
            formData.append("token", token); // from URL
            formData.append("new_password", newPassword);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/Authentication/reset_password`,
                formData,
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            setMessage(response.data.message || "Password reset successfully.");

            setTimeout(() => navigate('/admin/login'), 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error: Unable to reset password');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center mt-5">
            <div className="w-full md:w-1/2">
                {/* Forgot Password Form */}
                {step === 'forgot' && (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-center mb-4 text-2xl font-bold">Admin Forgot Password</h2>
                        <form onSubmit={handleForgotSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Reset Password Form (only if token exists) */}
                {step === 'reset' && token ? (
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <h2 className="text-center mb-4 text-2xl font-bold">Reset Password</h2>
                        <form onSubmit={handleResetSubmit}>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                ) : step === 'reset' && !token ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">Invalid or missing token.</div>
                ) : null}

                {/* Show success or error message */}
                {message && <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mt-3">{message}</div>}
            </div>
        </div>
    );
};

export default AdminForgotPassword;
