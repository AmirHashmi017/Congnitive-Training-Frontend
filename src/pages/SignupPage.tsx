import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Car, Flower2, Circle, Rabbit, BookOpen, Smile } from 'lucide-react';

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
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border-2 border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-text uppercase tracking-tight">Create Account</h1>
                    <p className="text-text-muted font-medium pt-2">Join the learning journey!</p>
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
                            placeholder="Enter unique username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2">Password</label>
                        <input
                            type="password"
                            required
                            className="bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-secondary focus:outline-none transition-all font-bold"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest px-2 text-center">Choose Your Avatar</label>
                        <div className="grid grid-cols-4 gap-3">
                            {AVATARS.map((avatar) => {
                                const Icon = avatar.Icon;
                                return (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar.id)}
                                        className={`
                                            aspect-square flex flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all
                                            ${selectedAvatar === avatar.id
                                                ? 'border-secondary bg-secondary/10 scale-105'
                                                : 'border-gray-100 hover:border-gray-200'}
                                        `}
                                    >
                                        <Icon className={`${avatar.color}`} size={24} />
                                        <span className="text-[10px] font-bold text-text uppercase tracking-tight">{avatar.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" className="btn-secondary w-full py-4 mt-4 text-xl tracking-wide uppercase">
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-8 text-text-muted font-bold">
                    Already have an account? <Link to="/login" className="text-secondary hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
