import React from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import MatchingCard from './MatchingCard';
import GamificationPanel from './GamificationPanel';
import ShapeRenderer from './ShapeRenderer';
import { HelpCircle } from 'lucide-react';

const GameContainer: React.FC = () => {
    const {
        round,
        streak,
        xp,
        difficulty,
        feedback,
        handleSelection
    } = useGameEngine();

    if (!round) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
            {/* Gameplay Area (flexible) */}
            <div className="w-full md:flex-1 flex flex-col h-full p-4 md:p-6 lg:p-8 border-r-2 border-gray-50 min-h-0">
                {/* Header / Rule Section */}
                <div className="w-full mb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${(streak % 5) * 20}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm flex flex-col items-center gap-2 relative overflow-hidden">
                        <div className="absolute top-2 left-2 text-secondary/5">
                            <HelpCircle size={24} />
                        </div>

                        <h2 className="text-base font-black text-text text-center uppercase tracking-tight">
                            {round.rule.description}
                        </h2>

                        <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center border-2 border-gray-50 shadow-sm">
                            <ShapeRenderer attributes={round.target} />
                        </div>
                    </div>
                </div>

                {/* Matching Grid */}
                <div className="w-full grid grid-cols-2 gap-4 flex-1 content-center overflow-hidden pb-2">
                    {round.options.map((option, index) => (
                        <div key={index} className="aspect-square max-h-[120px] lg:max-h-[160px] mx-auto w-full">
                            <MatchingCard
                                attributes={option}
                                onClick={() => handleSelection(index)}
                                feedback={feedback && index === round.options.indexOf(round.options[index]) ? (round.options[index] === (round as any).options[round.correctIndex] ? 'correct' : 'incorrect') : null}
                                isDisabled={!!feedback}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gamification Panel (capped width) */}
            <div className="w-full md:w-[30%] md:max-w-[360px]">
                <GamificationPanel
                    streak={streak}
                    xp={xp}
                    difficulty={difficulty}
                    seeds={Math.floor(xp / 50)}
                />
            </div>
        </div>
    );
};

export default GameContainer;
