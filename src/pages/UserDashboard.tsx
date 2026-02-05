import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
    User, Car, Flower2, Circle, Rabbit, BookOpen, Smile,
    ArrowLeft, History, BarChart3, LogOut, Edit3, Save, X
} from 'lucide-react';

const AVATARS = [
    { id: 'boy', name: 'Boy', Icon: User, color: 'text-blue-500' },
    { id: 'girl', name: 'Girl', Icon: Smile, color: 'text-pink-500' },
    { id: 'car', name: 'Car', Icon: Car, color: 'text-red-500' },
    { id: 'flower', name: 'Flower', Icon: Flower2, color: 'text-green-500' },
    { id: 'ball', name: 'Ball', Icon: Circle, color: 'text-orange-500' },
    { id: 'bunny', name: 'Bunny', Icon: Rabbit, color: 'text-purple-500' },
    { id: 'book', name: 'Book', Icon: BookOpen, color: 'text-indigo-500' },
];

const UserDashboard: React.FC = () => {
    const { user, logout, updateProfile } = useAuth();
    const [history, setHistory] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.username || '');
    const [editAvatar, setEditAvatar] = useState(user?.avatar || 'boy');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/user/history');
                setHistory(response.data);
            } catch (err) {
                console.error('Failed to fetch history');
            }
        };
        fetchHistory();
    }, []);

    const handleUpdate = async () => {
        try {
            await updateProfile({ username: editName, avatar: editAvatar });
            setIsEditing(false);
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const remainingSecs = seconds % 60;
        return `${mins}m ${remainingSecs}s`;
    };

    // Prepare aggregated chart data (one bar per day)
    const aggregatedData = history.reduce((acc: any, s: any) => {
        const dateKey = new Date(s.date).toLocaleDateString();
        const dayName = new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' });
        if (!acc[dateKey]) acc[dateKey] = { name: dayName, xp: 0, rawDate: new Date(s.date) };
        acc[dateKey].xp += s.xpEarned;
        return acc;
    }, {});

    const chartData = Object.values(aggregatedData)
        .sort((a: any, b: any) => (a.rawDate as any) - (b.rawDate as any))
        .slice(-7);

    const SelectedIcon = AVATARS.find(a => a.id === user?.avatar)?.Icon || User;
    const SelectedColor = AVATARS.find(a => a.id === user?.avatar)?.color || 'text-gray-400';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar / Profile Info */}
            <div className="w-full md:w-80 bg-white border-r-2 border-gray-100 flex flex-col h-full md:h-screen p-6 shrink-0">
                

                <div className="flex flex-col items-center gap-4 py-6 border-b-2 border-gray-50 mb-6">
                    <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner relative">
                        <SelectedIcon className={`${SelectedColor}`} size={48} />
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute bottom-0 right-0 bg-secondary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                        >
                            <Edit3 size={14} />
                        </button>
                    </div>

                    {isEditing ? (
                        <div className="flex flex-col gap-3 w-full">
                            <input
                                className="bg-gray-50 border-2 border-gray-100 p-2 rounded-xl text-center font-bold"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {AVATARS.map(a => {
                                    const AIcon = a.Icon;
                                    return (
                                        <button
                                            key={a.id}
                                            onClick={() => setEditAvatar(a.id)}
                                            className={`p-2 rounded-lg border-2 ${editAvatar === a.id ? 'border-secondary bg-secondary/10' : 'border-gray-50'}`}
                                        >
                                            <AIcon size={16} className={a.color} />
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleUpdate} className="flex-1 bg-primary text-white p-2 rounded-xl font-bold flex items-center justify-center gap-1"><Save size={16} /> Save</button>
                                <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-text rounded-xl p-2"><X size={16} /></button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-text uppercase tracking-tight">{user?.username}</h2>
                            <p className="text-text-muted font-bold">Level {user?.stats.difficulty} Explorer</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-between">
                        <span className="font-bold text-primary uppercase text-[10px] tracking-widest">Mastery XP</span>
                        <span className="text-xl font-black text-primary">{user?.stats.xp}</span>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-2xl flex items-center justify-between">
                        <span className="font-bold text-secondary uppercase text-[10px] tracking-widest">Total Seeds</span>
                        <span className="text-xl font-black text-secondary">{user?.stats.seeds}</span>
                    </div>
                    <div className="bg-warning/10 p-4 rounded-2xl flex items-center justify-between">
                        <span className="font-bold text-warning uppercase text-[10px] tracking-widest">Current Streak</span>
                        <span className="text-xl font-black text-warning">{user?.stats.streak}</span>
                    </div>

                </div>

                <button
                    onClick={logout}
                    className="mt-auto flex items-center justify-center gap-2 text-danger font-black uppercase tracking-widest py-4 border-t-2 border-gray-50 hover:bg-danger/5 transition-colors"
                >
                    <LogOut size={20} /> Sign Out
                </button>
            </div>

            {/* Main Dashboard Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-text uppercase tracking-tighter">Your Progress</h1>
                            <p className="text-text-muted font-medium pt-1">Visualize your cognitive growth and session history.</p>
                        </div>
                    </div>

                    {/* Training Modules Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:border-secondary transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="bg-secondary/10 p-3 rounded-2xl">
                                    <Smile className="text-secondary" size={32} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Module 1</span>
                                    <h3 className="text-xl font-black text-text uppercase tracking-tight">Matching Game</h3>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-text-muted font-medium mb-4">Improve cognitive flexibility through relational frame training exercises.</p>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-surface rounded-xl p-3 text-center border border-gray-50">
                                        <p className="text-[9px] font-black uppercase text-text-muted tracking-tight mb-1">Total XP</p>
                                        <p className="font-black text-secondary">{user?.stats.xp}</p>
                                    </div>
                                    <div className="bg-surface rounded-xl p-3 text-center border border-gray-50">
                                        <p className="text-[9px] font-black uppercase text-text-muted tracking-widest mb-1">Seeds</p>
                                        <p className="font-black text-primary">{user?.stats.seeds}</p>
                                    </div>
                                    <div className="bg-surface rounded-xl p-3 text-center border border-gray-50">
                                        <p className="text-[9px] font-black uppercase text-text-muted tracking-tight mb-1">Streak</p>
                                        <p className="font-black text-warning">{user?.stats.streak}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_4px_0_0_#1899d6] active:translate-y-1 active:shadow-none transition-all mt-2"
                            >
                                Play Module 1
                            </button>
                        </div>

                        {/* Module 2 & 3 Placeholders (Locked or Coming Soon) */}
                        <div className="bg-gray-100/50 rounded-3xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center opacity-60">
                            <div className="bg-gray-200 p-3 rounded-2xl mb-2">
                                <BookOpen className="text-gray-400" size={32} />
                            </div>
                            <h3 className="font-black text-gray-400 uppercase tracking-tight">More Modules</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Coming Soon</p>
                        </div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 className="text-secondary" />
                            <h3 className="font-black text-text tracking-widest uppercase">Weekly Performance (XP)</h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#afafaf', fontWeight: 'bold' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#afafaf', fontWeight: 'bold' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f7f7f7' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="xp" fill="#1cb0f6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b-2 border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <History className="text-primary" />
                                <h3 className="font-black text-text tracking-widest uppercase">Training History</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b-2 border-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">XP Earned</th>
                                        <th className="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">Time Spent</th>
                                        <th className="px-6 py-4 text-xs font-black text-text-muted uppercase tracking-widest">Games Used</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-gray-50">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center font-bold text-text-muted">No sessions recorded yet. Start training!</td>
                                        </tr>
                                    ) : history.map((session: any) => (
                                        <tr key={session._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-text">{new Date(session.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-black text-primary">+{session.xpEarned} XP</td>
                                            <td className="px-6 py-4 font-bold text-text-muted">{formatDuration(session.timeSpentInSeconds)}</td>
                                            <td className="px-6 py-4 flex flex-wrap gap-2">
                                                <span className="bg-surface px-3 py-1 rounded-full text-[10px] font-black uppercase text-secondary border border-secondary/10 tracking-tight">
                                                    Module 1: Matching Game
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
