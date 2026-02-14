import React, { useState } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';
import MatchingCard from './MatchingCard';
import GamificationPanel from './GamificationPanel';
import ShapeRenderer from './ShapeRenderer';
import { HelpCircle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameContainer: React.FC = () => {
    const navigate = useNavigate();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const {
        round,
        streak,
        xp,
        level,
        levelProgress,
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

            {feedbackPhrase && (
                <div className="absolute top-24 md:top-8 left-0 right-0 flex items-center justify-center z-[60] pointer-events-none">
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


            <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white border-b-2 border-gray-100 z-50">
                <h1 className="text-lg font-black text-text uppercase tracking-tight">Matching Game</h1>
                <button
                    onClick={() => setIsPanelOpen(!isPanelOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isPanelOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>


            {isPanelOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsPanelOpen(false)}
                />
            )}

            <div className="flex-1 md:w-2/3 flex flex-col h-full p-4 md:p-6 lg:p-8 md:border-r-2 border-gray-50 min-h-0 pt-20 md:pt-4">

                <div className="w-full mb-3">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${Math.min((levelProgress || 0) * 10, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm flex flex-col items-center gap-3 relative overflow-hidden">
                        <div className="absolute top-2 left-2 text-secondary/5">
                            <HelpCircle size={20} />
                        </div>

                        <h2 className="text-sm md:text-base font-black text-text text-center uppercase tracking-tight px-6 break-words w-full">
                            {round.rule.description}
                        </h2>

                        <div className={`bg-surface rounded-xl flex items-center justify-center border-2 border-gray-50 shadow-sm ${round.target.type === 'pattern' ? 'w-full max-w-[200px] h-24 p-2' :
                            round.target.type === 'text' ? 'w-full max-w-md px-4 py-3 min-h-[60px]' :
                                'w-20 h-20'
                            }`}>
                            <ShapeRenderer
                                attributes={round.target}
                                width={round.target.type === 'text' ? '100%' : round.target.type === 'pattern' ? '100%' : '100%'}
                                height={round.target.type === 'text' ? 'auto' : round.target.type === 'pattern' ? '100%' : '100%'}
                            />
                        </div>
                    </div>
                </div>


                <div className={`
                    w-full grid gap-3 md:gap-4 flex-1 content-start md:content-center
                    ${round.type === 'pattern' ? 'overflow-visible' : 'overflow-auto'}
                    ${round.type === 'word' || round.type === 'object' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2'}
                `}>
                    {round.options.map((option, index) => (
                        <div key={index} className={`
                            mx-auto w-full
                            ${round.type === 'pattern' ? 'h-auto max-h-[120px] md:max-h-[140px]' : 'aspect-square max-h-[140px] md:max-h-[160px]'}
                        `}>
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


            <div className={`
                fixed md:static top-0 right-0 z-50
                w-full md:w-1/3 bg-white
                transform transition-transform duration-300 ease-in-out
                ${isPanelOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                h-screen
            `}>
                <GamificationPanel
                    streak={streak}
                    xp={xp}
                    level={level}
                    seeds={seeds}
                    timer={timer}
                    onQuit={async () => {
                        await quitGame();
                        navigate('/dashboard');
                    }}
                    onClose={() => setIsPanelOpen(false)}
                    isGameActive={isGameActive}
                />
            </div>
        </div>
    );
};

export default GameContainer;