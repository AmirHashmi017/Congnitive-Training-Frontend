import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
    Users, TrendingUp, History, LogOut, ChevronRight,
    Search, User as UserIcon,
    Smile, Car, Flower2, Circle, Rabbit, BookOpen, Menu, XIcon,
    BarChart3
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AVATARS = [
    { id: 'boy', name: 'Boy', Icon: UserIcon, color: 'text-blue-500' },
    { id: 'girl', name: 'Girl', Icon: Smile, color: 'text-pink-500' },
    { id: 'car', name: 'Car', Icon: Car, color: 'text-red-500' },
    { id: 'flower', name: 'Flower', Icon: Flower2, color: 'text-green-500' },
    { id: 'ball', name: 'Ball', Icon: Circle, color: 'text-orange-500' },
    { id: 'bunny', name: 'Bunny', Icon: Rabbit, color: 'text-purple-500' },
    { id: 'book', name: 'Book', Icon: BookOpen, color: 'text-indigo-500' },
];

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/user/admin/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch users');
            setLoading(false);
        }
    };

    const fetchUserHistory = async (userId: string) => {
        try {
            const response = await api.get(`/user/admin/user/${userId}/history`);
            setHistory(response.data);
        } catch (err) {
            console.error('Failed to fetch user history');
        }
    };

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
        fetchUserHistory(user._id);
        setIsSidebarOpen(false); // Close sidebar on mobile if open
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Prepare aggregated chart data (one bar per day)
    const aggregatedData = history.reduce((acc: any, s: any) => {
        const dateKey = new Date(s.date).toLocaleDateString();
        const dayName = new Date(s.date).toLocaleDateString([], { weekday: 'short' });

        if (!acc[dateKey]) {
            acc[dateKey] = { name: dayName, xp: 0, rawDate: new Date(s.date) };
        }
        acc[dateKey].xp += s.xpEarned;
        return acc;
    }, {});

    const chartData = Object.values(aggregatedData)
        .sort((a: any, b: any) => a.rawDate.getTime() - b.rawDate.getTime())
        .slice(-7);

    if (loading) return <div className="h-screen w-screen flex items-center justify-center font-black uppercase tracking-widest text-secondary">Loading Admin...</div>;

    const UserListItem = ({ user: u }: { user: any }) => {
        const Icon = AVATARS.find(a => a.id === u.avatar)?.Icon || UserIcon;
        const Color = AVATARS.find(a => a.id === u.avatar)?.color || 'text-gray-400';
        const isActive = selectedUser?._id === u._id;

        return (
            <button
                onClick={() => handleUserClick(u)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${isActive ? 'bg-secondary/10 border-2 border-secondary' : 'bg-white border-2 border-gray-50 hover:border-gray-200'}`}
            >
                <div className={`p-2 rounded-xl bg-surface ${Color}`}>
                    <Icon size={24} />
                </div>
                <div className="flex-1 text-left">
                    <p className="font-black text-text uppercase tracking-tight leading-none">{u.username}</p>
                    <p className="text-[10px] font-bold text-text-muted mt-1 uppercase">XP: {u.stats.xp} • Streak: {u.stats.streak}</p>
                </div>
                <ChevronRight size={16} className="text-text-muted" />
            </button>
        );
    };

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden font-inter">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b-2 border-gray-100 z-50">
                <h1 className="text-xl font-black text-text uppercase tracking-tight">Admin</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
                    {isSidebarOpen ? <XIcon size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar - User List */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40
                w-80 bg-white border-r-2 border-gray-100 
                flex flex-col h-screen 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b-2 border-gray-50">
                    <h2 className="text-2xl font-black text-text uppercase tracking-tighter mb-4 flex items-center gap-2">
                        <Users className="text-secondary" /> Trainees
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm font-bold focus:border-secondary outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {filteredUsers.map(u => <UserListItem key={u._id} user={u} />)}
                </div>

                <button
                    onClick={logout}
                    className="p-6 border-t-2 border-gray-50 flex items-center justify-center gap-2 text-danger font-black uppercase tracking-widest text-xs hover:bg-danger/5 transition-colors"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto p-4 md:p-10">
                {selectedUser ? (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-3xl border-4 border-secondary/20 shadow-xl flex items-center justify-center">
                                    {React.createElement(AVATARS.find(a => a.id === selectedUser.avatar)?.Icon || UserIcon, {
                                        size: 48,
                                        className: AVATARS.find(a => a.id === selectedUser.avatar)?.color || 'text-gray-400'
                                    })}
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-3xl md:text-5xl font-black text-text uppercase tracking-tighter leading-none">{selectedUser.username}</h1>
                                    <p className="text-text-muted font-black uppercase tracking-widest text-xs md:text-sm mt-2 flex items-center gap-1">
                                        <TrendingUp size={14} className="text-secondary" /> Level {selectedUser.stats.difficulty} Explorer
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-white p-3 rounded-2xl border-2 border-gray-50 text-center">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">Total XP</p>
                                    <p className="text-lg font-black text-primary leading-none">{selectedUser.stats.xp}</p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border-2 border-gray-50 text-center">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">Seeds</p>
                                    <p className="text-lg font-black text-secondary leading-none">{selectedUser.stats.seeds}</p>
                                </div>
                                <div className="bg-white p-3 rounded-2xl border-2 border-gray-50 text-center">
                                    <p className="text-[8px] font-black uppercase text-text-muted tracking-widest mb-1">Best</p>
                                    <p className="text-lg font-black text-warning leading-none">{selectedUser.stats.maxStreak}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Performance Chart */}
                        <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm">
                            <h3 className="font-black text-text tracking-widest uppercase text-xs mb-6 flex items-center gap-2">
                                <BarChart3 className="text-secondary" size={16} /> Performance Trend (Last 7 Sessions)
                            </h3>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#afafaf', fontWeight: 'bold', fontSize: 10 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#afafaf', fontWeight: 'bold', fontSize: 10 }} />
                                        <Tooltip
                                            cursor={{ fill: '#f7f7f7' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="xp" fill="#1cb0f6" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-4 border-b-2 border-gray-50">
                                <h3 className="font-black text-text tracking-widest uppercase text-xs flex items-center gap-2">
                                    <History className="text-primary" size={16} /> Training Log
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b-2 border-gray-50">
                                        <tr>
                                            <th className="px-3 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Date</th>
                                            <th className="px-3 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">XP Earned</th>
                                            <th className="px-3 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Time</th>
                                            <th className="px-3 md:px-6 py-4 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest whitespace-nowrap">Module</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-gray-50">
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center font-bold text-text-muted italic">No sessions recorded.</td>
                                            </tr>
                                        ) : history.map((s) => (
                                            <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 md:px-6 py-4 font-bold text-text text-[11px] md:text-sm whitespace-nowrap">{new Date(s.date).toLocaleDateString()}</td>
                                                <td className="px-3 md:px-6 py-4 font-black text-primary text-[11px] md:text-sm whitespace-nowrap">+{s.xpEarned} XP</td>
                                                <td className="px-3 md:px-6 py-4 font-bold text-text-muted text-[11px] md:text-sm whitespace-nowrap">{formatDuration(s.timeSpentInSeconds)}</td>
                                                <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                                                    <span className="bg-surface px-2 py-1 rounded-full text-[8px] font-black uppercase text-secondary border border-secondary/10 tracking-tight whitespace-nowrap">
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
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                        <Users size={80} className="text-secondary mb-4" />
                        <h2 className="text-2xl font-black text-text uppercase tracking-tight">Select a Trainee</h2>
                        <p className="font-bold text-text-muted uppercase tracking-widest text-xs mt-2">View their detailed performance and history</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
