import React from 'react';
import { Sprout, Flame, Trophy, User } from 'lucide-react';

interface GamificationPanelProps {
    streak: number;
    xp: number;
    difficulty: number;
    seeds: number;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ streak, xp, difficulty, seeds }) => {
    return (
        <div className="h-full bg-white border-l-2 border-gray-100 p-6 flex flex-col gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner">
                    <User size={64} className="text-gray-300" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-text">Trainee</h2>
                    <p className="text-text-muted text-sm">Level {difficulty} Explorer</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="flex flex-col gap-4">
                <div className="bg-surface rounded-2xl p-4 flex items-center justify-between shadow-duo">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-xl">
                            <Sprout className="text-primary" size={24} />
                        </div>
                        <span className="font-bold text-text">Seeds</span>
                    </div>
                    <span className="text-xl font-black text-primary">{seeds}</span>
                </div>

                <div className="bg-surface rounded-2xl p-4 flex items-center justify-between shadow-duo">
                    <div className="flex items-center gap-3">
                        <div className="bg-warning/20 p-2 rounded-xl">
                            <Flame className="text-warning" size={24} />
                        </div>
                        <span className="font-bold text-text">Streak</span>
                    </div>
                    <span className="text-xl font-black text-warning">{streak}</span>
                </div>

                <div className="bg-surface rounded-2xl p-4 flex items-center justify-between shadow-duo">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/20 p-2 rounded-xl">
                            <Trophy className="text-secondary" size={24} />
                        </div>
                        <span className="font-bold text-text">XP</span>
                    </div>
                    <span className="text-xl font-black text-secondary">{xp}</span>
                </div>
            </div>

            {/* World Placeholder */}
            <div className="mt-auto bg-green-50 rounded-3xl p-6 border-b-4 border-green-200 aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10">
                    <p className="text-green-600 font-bold text-sm">Your Garden</p>
                    <p className="text-green-400 text-xs mt-1">Ready for growth</p>
                </div>
                {/* Simple decorative elements */}
                <div className="absolute bottom-0 right-0 p-2 opacity-20">
                    <Sprout size={48} className="text-green-500" />
                </div>
            </div>
        </div>
    );
};

export default GamificationPanel;
