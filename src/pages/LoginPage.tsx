import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(username, password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid username or password');
        }
    };

    return (
        <div className="w-screen h-screen bg-surface flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border-2 border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-text uppercase tracking-tight">Welcome Back</h1>
                    <p className="text-text-muted font-medium pt-2">Continue your training</p>
                </div>

                {error && (
                    <div className="mb-6 bg-danger/10 border-2 border-danger text-danger p-3 rounded-2xl text-center font-bold animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">User Name</label>
                        <input
                            type="text"
                            required
                            className="bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-secondary focus:outline-none transition-all font-bold"

                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="bg-gray-50 border-2 border-gray-100 p-4 pr-12 rounded-2xl focus:border-secondary focus:outline-none transition-all font-bold w-full"

                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-secondary w-full py-4 mt-4 text-xl tracking-wide uppercase">
                        Log In
                    </button>
                </form>

                <p className="text-center mt-8 text-text-muted font-bold">
                    Don't have an account? <Link to="/signup" className="text-secondary hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;