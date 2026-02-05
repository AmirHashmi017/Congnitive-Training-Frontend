import React from 'react';
import { Sprout, Flame, Trophy, User, LayoutDashboard, Car, Flower2, Circle, Rabbit, BookOpen, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GamificationPanelProps {
    streak: number;
    xp: number;
    difficulty: number;
    seeds: number;
    timer: number;
    onQuit: () => void;
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
        <div className="h-full w-full min-h-0 bg-white p-4 flex flex-col gap-6 overflow-auto">
            {/* Timer Display */}
            <div className="flex justify-center bg-gray-50 py-3 rounded-2xl border-2 border-gray-100 shadow-sm relative group overflow-hidden">
                <div className="text-center">
                    <p className="text-[10px] uppercase font-black text-text-muted tracking-widest mb-1">Session Time</p>
                    <p className="text-3xl font-black text-secondary tabular-nums tracking-tighter">
                        {formatTime(timer)}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="absolute inset-y-0 right-0 px-4 bg-secondary/10 flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform"
                    title="View Dashboard"
                >
                    <LayoutDashboard size={20} className="text-secondary" />
                </button>
            </div>

            {/* Avatar Section (compact) */}
            <div className="flex flex-col items-center gap-3 py-3">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner">
                    <SelectedIcon size={48} className={SelectedColor} />
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-text uppercase tracking-tight">{user?.username || 'Trainee'}</h2>
                    <p className="text-text-muted text-sm font-medium">Level {difficulty} Explorer</p>
                </div>
            </div>

            {/* Stats Section (compact) */}
            <div className="flex flex-col gap-3">
                <div className="bg-surface rounded-2xl p-3 flex items-center justify-between shadow-duo">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Sprout className="text-primary" size={20} />
                        </div>
                        <span className="font-bold text-text uppercase text-xs tracking-wider">Seeds</span>
                    </div>
                    <span className="text-lg font-black text-primary">{seeds}</span>
                </div>

                <div className="bg-surface rounded-2xl p-3 flex items-center justify-between shadow-duo">
                    <div className="flex items-center gap-3">
                        <div className="bg-warning/20 p-2 rounded-xl">
                            <Flame className="text-warning" size={20} />
                        </div>
                        <span className="font-bold text-text uppercase text-xs tracking-wider">Streak</span>
                    </div>
                    <span className="text-lg font-black text-warning">{streak}</span>
                </div>

                <div className="bg-surface rounded-2xl p-3 flex items-center justify-between shadow-duo">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/20 p-2 rounded-xl">
                            <Trophy className="text-secondary" size={20} />
                        </div>
                        <span className="font-bold text-text uppercase text-xs tracking-wider">XP</span>
                    </div>
                    <span className="text-lg font-black text-secondary">{xp}</span>
                </div>
            </div>

            {/* World Placeholder */}
            <div className="mt-4 bg-green-50 rounded-3xl p-6 border-b-4 border-green-200 aspect-video flex items-center justify-center relative overflow-hidden max-h-[40vh]">
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
            <div className="mt-auto pt-4 flex flex-col gap-3">
                {!isGameActive && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center font-bold animate-feedback">
                        Game Paused/Stopped
                    </div>
                )}
                <button
                    onClick={onQuit}
                    disabled={!isGameActive}
                    className={`
                        w-full py-4 rounded-2xl font-black uppercase tracking-wider transition-all
                        ${isGameActive
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_0_0_#b91c1c] active:translate-y-1 active:shadow-none'
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