import { useState, useCallback, useEffect, useRef } from 'react';
import type { PuzzleRound } from '../types';
import { generatePuzzle, getRulesByXP } from '../utils/solver';

export const useGameEngine = () => {
    const [round, setRound] = useState<PuzzleRound | null>(null);
    const [streak, setStreak] = useState(0);
    const [xp, setXp] = useState(0);
    const [difficulty, setDifficulty] = useState(1);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    // Use a ref to keep startNewRound stable and avoid accidental re-triggers when XP updates
    const xpRef = useRef(xp);
    useEffect(() => {
        xpRef.current = xp;
    }, [xp]);

    const startNewRound = useCallback(() => {
        const availableRules = getRulesByXP(xpRef.current);
        const rule = availableRules[Math.floor(Math.random() * availableRules.length)];
        const newPuzzle = generatePuzzle(rule);
        setRound(newPuzzle as any);
        setFeedback(null);
    }, []); // Identity is stable across XP updates

    useEffect(() => {
        startNewRound();
    }, [startNewRound]);

    const handleSelection = (index: number) => {
        if (!round || feedback) return;

        if (index === round.correctIndex) {
            setFeedback('correct');
            setStreak(s => s + 1);
            setXp(x => x + 10 + (streak * 2));

            // Basic Adaptive logic: increase difficulty every 5 streaks
            if ((streak + 1) % 5 === 0) {
                setDifficulty(d => Math.min(d + 1, 10));
            }

            // Auto start next round after 1 second
            setTimeout(() => {
                startNewRound();
            }, 1000);
        } else {
            setFeedback('incorrect');
            setStreak(0);

            // Auto start next round even on incorrect after 1 second
            setTimeout(() => {
                startNewRound();
            }, 1000);
        }
    };

    return {
        round,
        streak,
        xp,
        difficulty,
        feedback,
        handleSelection,
        startNewRound
    };
};
