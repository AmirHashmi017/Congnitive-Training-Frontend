import { useState, useCallback, useEffect, useRef } from 'react';
import type { PuzzleRound } from '../types';
import { generatePuzzle, getRulesByLevel } from '../utils/solver';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export const useGameEngine = () => {
    const { user, updateUser } = useAuth();
    const [round, setRound] = useState<PuzzleRound | null>(null);
    const [streak, setStreak] = useState(user?.stats.streak || 0);
    const [xp, setXp] = useState(user?.stats.xp || 0);
    const [seeds, setSeeds] = useState(user?.stats.seeds || 0);

    // Level Based Stats
    const [level, setLevel] = useState(user?.stats.level || 1);
    const [levelProgress, setLevelProgress] = useState(user?.stats.currentLevelProgress || 0);
    const [levelCorrectCount, setLevelCorrectCount] = useState(user?.stats.levelCorrectCount || 0);

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

    // Use a ref to keep startNewRound stable and avoid accidental re-triggers
    const levelRef = useRef(level);
    useEffect(() => {
        levelRef.current = level;
    }, [level]);

    const startNewRound = useCallback(() => {
        const availableRules = getRulesByLevel(levelRef.current);
        const rule = availableRules[Math.floor(Math.random() * availableRules.length)];
        const newPuzzle = generatePuzzle(rule);

        // Track unique modules used in this session
        if (rule.matchType.includes('color')) modulesUsed.current.add('Module 1: Matching Game');
        if (rule.matchType.includes('shape')) modulesUsed.current.add('Module 2: Shapes');
        if (rule.matchType.includes('value')) modulesUsed.current.add('Module 3: Numeric');

        setRound(newPuzzle as any);
        setFeedback(null);
        setFeedbackPhrase(null);
    }, []);

    useEffect(() => {
        startNewRound();
    }, [startNewRound]);

    // Persistence Effect: Save stats to backend after every successful state change
    const syncToBackend = async (
        currentXP: number,
        currentStreak: number,
        currentSeeds: number,
        currentLevel: number,
        currentProgress: number,
        currentCorrect: number
    ) => {
        try {
            const response = await api.post('/user/sync', {
                xp: currentXP,
                streak: currentStreak,
                seeds: currentSeeds,
                difficulty: 1, // Deprecated but kept for schema compatibility or reset
                level: currentLevel,
                currentLevelProgress: currentProgress,
                levelCorrectCount: currentCorrect
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

        const isCorrect = index === round.correctIndex;

        // Calculate new stats
        const nextXP = isCorrect ? xp + 10 + (streak * 2) : xp;
        const nextStreak = isCorrect ? streak + 1 : 0;

        // Level Progression Logic
        let nextLevel = level;
        let nextProgress = levelProgress + 1;
        let nextCorrectCount = levelCorrectCount + (isCorrect ? 1 : 0);
        let levelUpOccurred = false;
        let nextSeeds = seeds;

        // Check if batch is complete (10 questions)
        if (nextProgress >= 10) {
            if (nextCorrectCount === 10) {
                // Passed Level
                levelUpOccurred = true;

                // Cap at Level 12 (Infinity Level)
                let newLevel = level + 1;
                if (newLevel > 12) newLevel = 12;

                // If already at 12, we stay at 12 but loop progress
                if (level === 12) newLevel = 12;

                nextLevel = newLevel;
                // Seeds earned on level up or batch completion at max level
                nextSeeds = seeds + 1;
            }

            // Always reset progress after batch completion (win or lose)
            nextProgress = 0;
            nextCorrectCount = 0;

            if (isCorrect) {
                setFeedbackPhrase(levelUpOccurred ? "LEVEL UP!" : "Round Complete!");
            }
        }

        // IMMEDIATE RESET ON ERROR (Strict Mode)
        // User requested: "ehn we give any answer wrong that bar in green on top of question don't become empty again"
        // This implies if they get one wrong, they lose the current progress of the batch.
        if (!isCorrect) {
            nextProgress = 0;
            nextCorrectCount = 0;
            // setFeedbackPhrase handled below
        }

        // Apply State Updates
        if (isCorrect) {
            setFeedback('correct');
            // Only set random phrase if not Level Up (which sets it specific above)
            if (nextProgress !== 0) { // If nextProgress is 0, it means a batch just completed or was reset, so phrase is already set
                setFeedbackPhrase(correctPhrases[Math.floor(Math.random() * correctPhrases.length)]);
            }
        } else {
            setFeedback('incorrect');
            setFeedbackPhrase("Incorrect. Progress Reset!");
        }

        setStreak(nextStreak);
        setXp(nextXP);
        setSeeds(nextSeeds);
        setLevel(nextLevel);
        setLevelProgress(nextProgress);
        setLevelCorrectCount(nextCorrectCount);

        // Persist immediately
        syncToBackend(nextXP, nextStreak, nextSeeds, nextLevel, nextProgress, nextCorrectCount);

        // Auto start next round after delay
        setTimeout(() => {
            if (isGameActive) startNewRound();
        }, 1500); // Slightly longer delay to see result
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
        seeds,
        level,
        levelProgress,
        levelCorrectCount,
        feedback,
        feedbackPhrase,
        timer,
        isGameActive,
        handleSelection,
        startNewRound,
        quitGame
    };
};
