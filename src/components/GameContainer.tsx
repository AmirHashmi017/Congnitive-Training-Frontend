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
        <div className="flex flex-col md:flex-row min-h-screen bg-background">
            {/* 2/3 Gameplay Area */}
            <div className="flex-1 p-6 md:p-12 flex flex-col">
                {/* Header / Rule Section */}
                <div className="max-w-3xl mx-auto w-full mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-4 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${(streak % 5) * 20}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-6 relative overflow-hidden">
                        <div className="absolute top-4 left-4 text-secondary/20">
                            <HelpCircle size={48} />
                        </div>

                        <h2 className="text-2xl font-black text-text text-center uppercase tracking-tight">
                            {round.rule.description}
                        </h2>

                        <div className="w-32 h-32 bg-surface rounded-2xl flex items-center justify-center border-2 border-gray-50 shadow-sm">
                            <ShapeRenderer attributes={round.target} />
                        </div>
                    </div>
                </div>

                {/* Matching Grid */}
                <div className="max-w-4xl mx-auto w-full grid grid-cols-2 gap-4 md:gap-8 flex-1 content-center">
                    {round.options.map((option, index) => (
                        <div key={index} className="aspect-square max-h-[250px] mx-auto w-full">
                            <MatchingCard
                                attributes={option}
                                onClick={() => handleSelection(index)}
                                feedback={feedback && index === round.options.indexOf(round.options[index]) ? (round.options[index] === round.options[round.correctIndex] ? 'correct' : 'incorrect') : null}
                                isDisabled={!!feedback}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 1/3 Gamification Panel */}
            <div className="w-full md:w-1/3 lg:w-1/4">
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
