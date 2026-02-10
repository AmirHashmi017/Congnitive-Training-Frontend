import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { LEVEL_TITLES } from '../utils/constants';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
    User, Car, Flower2, Circle, Rabbit, BookOpen, Smile,
    History, BarChart3, LogOut, Edit3, Save, X, Menu, XIcon
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    const SidebarContent = () => (
        <>
            <div className="flex flex-col items-center gap-4 py-4 border-b-2 border-gray-50 mb-4">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner relative">
                    <SelectedIcon className={`${SelectedColor}`} size={40} />
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute bottom-0 right-0 bg-secondary text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        <Edit3 size={12} />
                    </button>
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-3 w-full">
                        <input
                            className="bg-gray-50 border-2 border-gray-100 p-2 rounded-xl text-center font-bold text-sm"
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
                                        className={`p-2 rounded-lg border-2 flex items-center justify-center ${editAvatar === a.id ? 'border-secondary bg-secondary/10' : 'border-gray-50'}`}
                                    >
                                        <AIcon size={20} className={a.color} />
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleUpdate} className="flex-1 bg-primary text-white p-2 rounded-xl font-bold flex items-center justify-center gap-1 text-xs"><Save size={14} /> Save</button>
                            <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-text rounded-xl p-2"><X size={14} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-xl font-black text-text uppercase tracking-tight">{user?.username}</h2>
                        <p className="text-text-muted font-bold text-sm">Level {user?.stats.level} {LEVEL_TITLES[user?.stats.level || 1] || 'Explorer'}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="bg-primary/10 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-primary uppercase text-[10px] tracking-widest">Mastery XP</span>
                    <span className="text-lg font-black text-primary">{user?.stats.xp}</span>
                </div>
                <div className="bg-secondary/10 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-secondary uppercase text-[10px] tracking-widest">Total Seeds</span>
                    <span className="text-lg font-black text-secondary">{user?.stats.seeds}</span>
                </div>
                <div className="bg-warning/10 p-3 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-warning uppercase text-[10px] tracking-widest">Current Streak</span>
                    <span className="text-lg font-black text-warning">{user?.stats.streak}</span>
                </div>
            </div>

            <button
                onClick={logout}
                className="mt-auto flex items-center justify-center gap-2 text-danger font-black uppercase tracking-widest py-3 border-t-2 border-gray-50 hover:bg-danger/5 transition-colors text-sm"
            >
                <LogOut size={18} /> Sign Out
            </button>
        </>
    );

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
          
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-2 border-gray-100">
                <h1 className="text-xl font-black text-text uppercase tracking-tight">Dashboard</h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <XIcon size={24} /> : <Menu size={24} />}
                </button>
            </div>

            
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            
            <div className={`
                fixed md:static inset-y-0 left-0 z-50
                w-80 bg-white border-r-2 border-gray-100 
                flex flex-col h-screen p-6 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                overflow-y-auto
            `}>
                <SidebarContent />
            </div>

           
            <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    <div className="hidden md:block">
                        <h1 className="text-3xl font-black text-text uppercase tracking-tighter">Your Progress</h1>
                        <p className="text-text-muted font-medium text-sm pt-1">Visualize your cognitive growth and session history.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:border-secondary transition-colors group">
                            <div className="flex items-start justify-between">
                                <div className="bg-secondary/10 p-2 rounded-xl">
                                    <Smile className="text-secondary" size={24} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black uppercase text-text-muted tracking-widest">Module 1</span>
                                    <h3 className="text-lg font-black text-text uppercase tracking-tight">Matching Game</h3>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-xs text-text-muted font-medium mb-3">Improve cognitive flexibility through relational frame training exercises.</p>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-surface rounded-lg p-2 text-center border border-gray-50">
                                        <p className="text-[8px] font-black uppercase text-text-muted tracking-tight mb-1">Total XP</p>
                                        <p className="font-black text-secondary text-sm">{user?.stats.xp}</p>
                                    </div>
                                    <div className="bg-surface rounded-lg p-2 text-center border border-gray-50">
                                        <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">Seeds</p>
                                        <p className="font-black text-primary text-sm">{user?.stats.seeds}</p>
                                    </div>
                                    <div className="bg-surface rounded-lg p-2 text-center border border-gray-50">
                                        <p className="text-[8px] font-black uppercase text-text-muted tracking-tight mb-1">Streak</p>
                                        <p className="font-black text-warning text-sm">{user?.stats.streak}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-secondary text-white py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_3px_0_0_#1899d6] active:translate-y-1 active:shadow-none transition-all"
                            >
                                Play Module 1
                            </button>
                        </div>

                        <div className="bg-gray-100/50 rounded-2xl border-2 border-dashed border-gray-200 p-4 flex flex-col items-center justify-center text-center opacity-60">
                            <div className="bg-gray-200 p-2 rounded-xl mb-2">
                                <BookOpen className="text-gray-400" size={24} />
                            </div>
                            <h3 className="font-black text-gray-400 uppercase tracking-tight text-sm">More Modules</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Coming Soon</p>
                        </div>
                    </div>

                    
                    <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="text-secondary" size={20} />
                            <h3 className="font-black text-text tracking-widest uppercase text-sm">Weekly Performance (XP)</h3>
                        </div>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#afafaf', fontWeight: 'bold', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#afafaf', fontWeight: 'bold', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f7f7f7' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: 12 }}
                                    />
                                    <Bar dataKey="xp" fill="#1cb0f6" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                   
                    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b-2 border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="text-primary" size={20} />
                                <h3 className="font-black text-text tracking-widest uppercase text-sm">Training History</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b-2 border-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">Date</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">XP Earned</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">Time Spent</th>
                                        <th className="px-4 py-3 text-[10px] font-black text-text-muted uppercase tracking-widest">Games Used</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-gray-50">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center font-bold text-text-muted text-sm">No sessions recorded yet. Start training!</td>
                                        </tr>
                                    ) : history.map((session: any) => (
                                        <tr key={session._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-bold text-text text-sm">{new Date(session.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 font-black text-primary text-sm">+{session.xpEarned} XP</td>
                                            <td className="px-4 py-3 font-bold text-text-muted text-sm">{formatDuration(session.timeSpentInSeconds)}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-surface px-2 py-1 rounded-full text-[8px] font-black uppercase text-secondary border border-secondary/10 tracking-tight">
                                                    Module 1
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