import React from 'react';
import { Sprout, Flame, Trophy, User, LayoutDashboard, Car, Flower2, Circle, Rabbit, BookOpen, Smile, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GamificationPanelProps {
    streak: number;
    xp: number;
    difficulty: number;
    seeds: number;
    timer: number;
    onQuit: () => void;
    onClose?: () => void;
    isGameActive: boolean;
}

const AVATARS = [
    { id: 'boy', name: 'Boy', Icon: User, color: 'text-blue-500' },
    { id: 'girl', name: 'Girl', Icon: Smile, color: 'text-pink-500' },
    { id: 'car', name: 'Car', Icon: Car, color: 'text-red-500' },
    { id: 'flower', name: 'Flower', Icon: Flower2, color: 'text-green-500' },
    { id: 'ball', name: 'Ball', Icon: Circle, color: 'text-orange-500' },
    { id: 'bunny', name: 'Bunny', Icon: Rabbit, color: 'text-purple-500' },
    { id: 'book', name: 'Book', Icon: BookOpen, color: 'text-indigo-500' },
];

const GamificationPanel: React.FC<GamificationPanelProps> = ({
    streak,
    xp,
    difficulty,
    seeds,
    timer,
    onQuit,
    onClose,
    isGameActive
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const SelectedIcon = AVATARS.find(a => a.id === user?.avatar)?.Icon || User;
    const SelectedColor = AVATARS.find(a => a.id === user?.avatar)?.color || 'text-gray-300';

    return (
        <div className="h-full w-full bg-white p-4 flex flex-col gap-4 overflow-hidden relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="md:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-lg text-text-muted z-50"
                >
                    <X size={20} />
                </button>
            )}

            {/* Timer Display */}
            <div className="flex justify-center bg-gray-50 py-2 rounded-2xl border-2 border-gray-100 shadow-sm relative group overflow-hidden shrink-0">
                <div className="text-center">
                    <p className="text-[9px] uppercase font-black text-text-muted tracking-widest mb-1">Session Time</p>
                    <p className="text-2xl font-black text-secondary tabular-nums tracking-tighter">
                        {formatTime(timer)}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute inset-y-0 right-0 px-3 bg-secondary/10 flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform"
                    title="View Dashboard"
                >
                    <LayoutDashboard size={18} className="text-secondary" />
                </button>
            </div>

            {/* Avatar Section (compact) */}
            <div className="flex flex-col items-center gap-2 py-2 shrink-0">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner">
                    <SelectedIcon size={40} className={SelectedColor} />
                </div>
                <div className="text-center">
                    <h2 className="text-base font-bold text-text uppercase tracking-tight">{user?.username || 'Trainee'}</h2>
                    <p className="text-text-muted text-xs font-medium">Level {difficulty} Explorer</p>
                </div>
            </div>

            {/* Stats Section - Three Separate Cards in One Row like Module 1 */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
                {/* Seeds Card */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-2 flex flex-col items-center justify-center">
                    <div className="bg-primary/10 p-2 rounded-lg mb-1">
                        <Sprout className="text-primary" size={16} />
                    </div>
                    <span className="font-bold text-text uppercase text-[8px] tracking-wider">Seeds</span>
                    <span className="text-lg font-black text-primary">{seeds}</span>
                </div>

                {/* Streak Card */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-2 flex flex-col items-center justify-center">
                    <div className="bg-warning/10 p-2 rounded-lg mb-1">
                        <Flame className="text-warning" size={16} />
                    </div>
                    <span className="font-bold text-text uppercase text-[8px] tracking-wider">Streak</span>
                    <span className="text-lg font-black text-warning">{streak}</span>
                </div>

                {/* XP Card */}
                <div className="bg-white rounded-xl border-2 border-gray-100 shadow-sm p-2 flex flex-col items-center justify-center">
                    <div className="bg-secondary/10 p-2 rounded-lg mb-1">
                        <Trophy className="text-secondary" size={16} />
                    </div>
                    <span className="font-bold text-text uppercase text-[8px] tracking-wider">XP</span>
                    <span className="text-lg font-black text-secondary">{xp}</span>
                </div>
            </div>

            {/* World Placeholder */}
            <div className="flex-1 bg-green-50 rounded-3xl p-6 border-b-4 border-green-200 flex items-center justify-center relative overflow-hidden min-h-0">
                <div className="text-center z-10 -translate-y-2">
                    <p className="text-green-600 font-bold text-sm">Your Garden</p>
                    <p className="text-green-400 text-xs mt-1">Ready for growth</p>
                </div>
                {/* Simple decorative elements */}
                <div className="absolute bottom-0 right-0 p-2 opacity-20">
                    <Sprout size={48} className="text-green-500" />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-3 shrink-0">
                {!isGameActive && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-center font-bold text-sm animate-feedback">
                        Game Paused/Stopped
                    </div>
                )}
                <button
                    onClick={onQuit}
                    disabled={!isGameActive}
                    className={`
                        w-full py-3 rounded-2xl font-black uppercase tracking-wider transition-all text-sm
                        ${isGameActive
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_3px_0_0_#b91c1c] active:translate-y-1 active:shadow-none'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                >
                    Quit Game
                </button>
            </div>
        </div>
    );
};

export default GamificationPanel;