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
        <div className="h-full w-full min-h-0 bg-white p-4 flex flex-col gap-6 overflow-auto">
            {/* Avatar Section (compact) */}
            <div className="flex flex-col items-center gap-3 py-3">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner">
                    <User size={48} className="text-gray-300" />
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-text uppercase tracking-tight">Trainee</h2>
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
        </div>
    );
};

export default GamificationPanel;