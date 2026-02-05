import { useState, useCallback, useEffect, useRef } from 'react';
import type { PuzzleRound } from '../types';
import { generatePuzzle, getRulesByXP } from '../utils/solver';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export const useGameEngine = () => {
    const { user, updateUser } = useAuth();
    const [round, setRound] = useState<PuzzleRound | null>(null);
    const [streak, setStreak] = useState(user?.stats.streak || 0);
    const [xp, setXp] = useState(user?.stats.xp || 0);
    const [difficulty, setDifficulty] = useState(user?.stats.difficulty || 1);
    const [seeds, setSeeds] = useState(user?.stats.seeds || 0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [feedbackPhrase, setFeedbackPhrase] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);

    // Initial session stats
    const sessionStartXP = useRef(xp);
    const modulesUsed = useRef(new Set<string>());

    // Timer effect
    useEffect(() => {
        let interval: number | undefined;
        if (isGameActive) {
            interval = window.setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        return () => window.clearInterval(interval);
    }, [isGameActive]);

    // Use a ref to keep startNewRound stable and avoid accidental re-triggers when XP updates
    const xpRef = useRef(xp);
    useEffect(() => {
        xpRef.current = xp;
    }, [xp]);

    const startNewRound = useCallback(() => {
        const availableRules = getRulesByXP(xpRef.current);
        const rule = availableRules[Math.floor(Math.random() * availableRules.length)];
        const newPuzzle = generatePuzzle(rule);

        // Track unique modules used in this session
        if (rule.matchType.includes('color')) modulesUsed.current.add('Module 1: Matching Game'); // Updated name for consistency
        if (rule.matchType.includes('shape')) modulesUsed.current.add('Module 2: Shapes');
        if (rule.matchType.includes('value')) modulesUsed.current.add('Module 3: Numeric');

        setRound(newPuzzle as any);
        setFeedback(null);
        setFeedbackPhrase(null);
    }, []); // Identity is stable across XP updates

    useEffect(() => {
        startNewRound();
    }, [startNewRound]);

    // Persistence Effect: Save stats to backend after every successful state change
    const syncToBackend = async (currentXP: number, currentStreak: number, currentSeeds: number, currentDifficulty: number) => {
        try {
            const response = await api.post('/user/sync', {
                xp: currentXP,
                streak: currentStreak,
                seeds: currentSeeds,
                difficulty: currentDifficulty
            });
            // Update global auth state instantly
            updateUser(response.data);
        } catch (err) {
            console.error('Failed to sync game state');
        }
    };

    const handleSelection = (index: number) => {
        if (!round || feedback || !isGameActive) return;

        const correctPhrases = ["Great Job", "You are on a roll", "Keep it up", "You are awesome"];
        const incorrectPhrases = ["That’s not right but try again", "Keep practicing"];

        if (index === round.correctIndex) {
            const nextXP = xp + 10 + (streak * 2);
            const nextStreak = streak + 1;
            const nextSeeds = seeds + (nextStreak % 5 === 0 ? 1 : 0);
            let nextDifficulty = difficulty;

            if (nextStreak % 5 === 0) {
                nextDifficulty = Math.min(difficulty + 1, 10);
            }

            setFeedback('correct');
            setFeedbackPhrase(correctPhrases[Math.floor(Math.random() * correctPhrases.length)]);
            setStreak(nextStreak);
            setXp(nextXP);
            setSeeds(nextSeeds);
            setDifficulty(nextDifficulty);

            // Persist immediately
            syncToBackend(nextXP, nextStreak, nextSeeds, nextDifficulty);

            // Auto start next round after 1 second
            setTimeout(() => {
                if (isGameActive) startNewRound();
            }, 1000);
        } else {
            setFeedback('incorrect');
            setFeedbackPhrase(incorrectPhrases[Math.floor(Math.random() * incorrectPhrases.length)]);
            setStreak(0);

            // Persist streak reset
            syncToBackend(xp, 0, seeds, difficulty);

            // Auto start next round even on incorrect after 1 second
            setTimeout(() => {
                if (isGameActive) startNewRound();
            }, 1000);
        }
    };

    const quitGame = async () => {
        setIsGameActive(false);
        // Save session history
        try {
            await api.post('/user/session', {
                xpEarned: xp - sessionStartXP.current,
                timeSpentInSeconds: timer,
                modulesUsed: Array.from(modulesUsed.current)
            });
        } catch (err) {
            console.error('Failed to save session');
        }
    };

    return {
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
        startNewRound,
        quitGame
    };
};
