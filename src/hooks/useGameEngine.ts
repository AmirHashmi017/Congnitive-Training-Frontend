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

    const [level, setLevel] = useState(user?.stats.level || 1);
    const [levelProgress, setLevelProgress] = useState(user?.stats.currentLevelProgress || 0);
    const [levelCorrectCount, setLevelCorrectCount] = useState(user?.stats.levelCorrectCount || 0);

    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [feedbackPhrase, setFeedbackPhrase] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [isGameActive, setIsGameActive] = useState(true);


    const sessionStartXP = useRef(xp);
    const modulesUsed = useRef(new Set<string>());


    useEffect(() => {
        let interval: number | undefined;
        if (isGameActive) {
            interval = window.setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        return () => window.clearInterval(interval);
    }, [isGameActive]);


    const levelRef = useRef(level);
    useEffect(() => {
        levelRef.current = level;
    }, [level]);

    const startNewRound = useCallback(() => {
        const availableRules = getRulesByLevel(levelRef.current);
        const rule = availableRules[Math.floor(Math.random() * availableRules.length)];
        const newPuzzle = generatePuzzle(rule);

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
            updateUser(response.data);
        } catch (err) {
            console.error('Failed to sync game state');
        }
    };

    const handleSelection = (index: number) => {
        if (!round || feedback || !isGameActive) return;

        const correctPhrases = ["Great Job", "You are on a roll", "Keep it up", "You are awesome"];

        const isCorrect = index === round.correctIndex;

        const nextXP = isCorrect ? xp + 10 + (streak * 2) : xp;
        const nextStreak = isCorrect ? streak + 1 : 0;

     
        let nextLevel = level;
        let nextProgress = levelProgress + 1;
        let nextCorrectCount = levelCorrectCount + (isCorrect ? 1 : 0);
        let levelUpOccurred = false;
        let nextSeeds = seeds;

        if (nextProgress >= 10) {
            if (nextCorrectCount === 10) {
                levelUpOccurred = true;

                let newLevel = level + 1;
                if (newLevel > 13) newLevel = 13;

                if (level === 13) newLevel = 13;

                nextLevel = newLevel;
                nextSeeds = seeds + 1;
            }

            nextProgress = 0;
            nextCorrectCount = 0;

            if (isCorrect) {
                setFeedbackPhrase(levelUpOccurred ? "LEVEL UP!" : "Round Complete!");
            }
        }

        if (!isCorrect) {
            nextProgress = 0;
            nextCorrectCount = 0;
            
        }

        if (isCorrect) {
            setFeedback('correct');
            
            if (nextProgress !== 0) { 
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

       
        syncToBackend(nextXP, nextStreak, nextSeeds, nextLevel, nextProgress, nextCorrectCount);

        
        setTimeout(() => {
            if (isGameActive) startNewRound();
        }, 1500); 
    };

    const quitGame = async () => {
        setIsGameActive(false);
        
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
