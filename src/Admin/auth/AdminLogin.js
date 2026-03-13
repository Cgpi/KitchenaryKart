import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const { adminLogin } = useAdminAuth();
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminLogin(login, password);
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    const handleForgotPassword = () => {
        navigate('/admin/forgot-password');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                    className="w-80 mx-2.5 my-2.5 p-2.5 rounded border border-gray-300 text-sm"
                />

                {/* Password with aesthetic eye icon */}
                <div className="relative w-80 mx-2.5 my-2.5">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2.5 pr-10 rounded border border-gray-300 text-sm"
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                </div>

                <button type="submit" className="px-5 py-2.5 rounded border-none bg-blue-400 text-white cursor-pointer mt-2.5 hover:bg-blue-500">
                    Login
                </button>
            </form>

            <div className="mt-5 text-center">
                <span onClick={handleForgotPassword} className="text-blue-600 cursor-pointer underline hover:text-blue-800">
                    Forgot Password?
                </span>
            </div>
        </div>
    );
};

export default AdminLogin;
