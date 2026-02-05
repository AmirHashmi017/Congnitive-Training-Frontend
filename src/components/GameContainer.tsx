import React from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import MatchingCard from './MatchingCard';
import GamificationPanel from './GamificationPanel';
import ShapeRenderer from './ShapeRenderer';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameContainer: React.FC = () => {
    const navigate = useNavigate();
    const {
        round,
        streak,
        xp,
        difficulty,
        seeds,
        feedback,
        feedbackPhrase,
        timer,
        isGameActive,
        handleSelection,
        quitGame
    } = useGameEngine();

    if (!round) return <div>Loading...</div>;

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-background overflow-hidden relative">
            {/* Feedback Overlay - Moved to top */}
            {feedbackPhrase && (
                <div className="absolute top-8 left-0 right-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className={`
                        px-8 py-3 rounded-2xl shadow-xl border-4 transform animate-feedback
                        ${feedback === 'correct' ? 'bg-primary border-primary-dark text-white' : 'bg-danger border-danger-dark text-white'}
                    `}>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider">
                            {feedbackPhrase}
                        </h3>
                    </div>
                </div>
            )}

            {/* Gameplay Area - 75% width */}
            <div className="w-full md:w-2/3 flex flex-col h-full p-4 md:p-6 lg:p-8 border-r-2 border-gray-50 min-h-0 shrink-0">
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

            {/* Gamification Panel - 25% width */}
            <div className="w-full md:w-1/3 h-full shrink-0">
                <GamificationPanel
                    streak={streak}
                    xp={xp}
                    difficulty={difficulty}
                    seeds={seeds}
                    timer={timer}
                    onQuit={async () => {
                        await quitGame();
                        navigate('/dashboard');
                    }}
                    isGameActive={isGameActive}
                />
            </div>
        </div>
    );
};

export default GameContainer;