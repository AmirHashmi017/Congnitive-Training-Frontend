import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Car, Flower2, Circle, Rabbit, BookOpen, Smile, Eye, EyeOff } from 'lucide-react';

const AVATARS = [
    { id: 'boy', name: 'Boy', Icon: User, color: 'text-blue-500' },
    { id: 'girl', name: 'Girl', Icon: Smile, color: 'text-pink-500' },
    { id: 'car', name: 'Car', Icon: Car, color: 'text-red-500' },
    { id: 'flower', name: 'Flower', Icon: Flower2, color: 'text-green-500' },
    { id: 'ball', name: 'Ball', Icon: Circle, color: 'text-orange-500' },
    { id: 'bunny', name: 'Bunny', Icon: Rabbit, color: 'text-purple-500' },
    { id: 'book', name: 'Book', Icon: BookOpen, color: 'text-indigo-500' },
];

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('boy');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signup(username, password, selectedAvatar);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create account');
        }
    };

    return (
        <div className="w-screen h-screen bg-surface flex items-center justify-center p-3">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-5 border-2 border-gray-100">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-black text-text uppercase tracking-tight">Create Account</h1>
                    <p className="text-text-muted font-medium text-sm pt-1">Join the learning journey!</p>
                </div>

                {error && (
                    <div className="mb-3 bg-danger/10 border-2 border-danger text-danger p-2 rounded-xl text-center font-bold text-sm animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">User Name</label>
                        <input
                            type="text"
                            required
                            className="bg-gray-50 border-2 border-gray-100 p-3 rounded-xl focus:border-secondary focus:outline-none transition-all font-bold text-sm"
                            placeholder="Enter unique username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="bg-gray-50 border-2 border-gray-100 p-3 pr-11 rounded-xl focus:border-secondary focus:outline-none transition-all font-bold w-full text-sm"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-2 text-center">Choose Your Avatar</label>
                        <div className="grid grid-cols-4 gap-2">
                            {AVATARS.map((avatar) => {
                                const Icon = avatar.Icon;
                                return (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar.id)}
                                        className={`
                                            h-20 flex flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all
                                            ${selectedAvatar === avatar.id
                                                ? 'border-secondary bg-secondary/10 scale-105'
                                                : 'border-gray-100 hover:border-gray-200'}
                                        `}
                                    >
                                        <Icon className={`${avatar.color}`} size={28} />
                                        <span className="text-[9px] font-bold text-text uppercase tracking-tight">{avatar.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" className="btn-secondary w-full py-3 mt-2 text-lg tracking-wide uppercase">
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-4 text-text-muted font-bold text-sm">
                    Already have an account? <Link to="/login" className="text-secondary hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;