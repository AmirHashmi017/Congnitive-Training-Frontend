import type { ShapeAttributes, GameRule } from '../types';
import { ShapeFactory } from './shapeFactory';

/**
 * Validates if an option matches the target based on a specific rule
 */
export const checkMatch = (target: ShapeAttributes, option: ShapeAttributes, rule: GameRule): boolean => {
    switch (rule.matchType) {
        case 'color':
            return target.color === option.color;
        case 'shape':
            return target.type === option.type;
        case 'size':
            return Math.abs(target.size - option.size) < 0.1;
        case 'not_color':
            return target.color !== option.color;
        case 'not_shape':
            return target.type !== option.type;
        case 'word':
            // Word matching will be implemented in UI layer where names are mapped
            return target.type === option.type;
        default:
            return false;
    }
};

export const RULE_POOL: GameRule[] = [
    { id: '1', description: 'Match the same color', matchType: 'color' },
    { id: '2', description: 'Match the same shape', matchType: 'shape' },
    { id: '3', description: 'Match by size', matchType: 'size' },
    { id: '4', description: 'Find a DIFFERENT color', matchType: 'not_color' },
    { id: '5', description: 'Find a DIFFERENT shape', matchType: 'not_shape' },
];

/**
 * Core Solver Engine: Generates exactly one correct answer and 3 smart distractors
 */
export const generatePuzzle = (rule: GameRule): { target: ShapeAttributes, options: ShapeAttributes[], correctIndex: number } => {
    const target = ShapeFactory.generateRandomShape();
    const options: ShapeAttributes[] = [target]; // Start with the correct one

    // Need 3 more distractors
    while (options.length < 4) {
        const candidate = ShapeFactory.generateRandomShape();

        // Check if it's accidentally correct
        const isCorrect = checkMatch(target, candidate, rule);

        if (!isCorrect) {
            // It's a valid distractor
            options.push(candidate);
        }
    }

    // Shuffle options
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.findIndex(o => o === target);

    return { target, options: shuffled, correctIndex, rule } as any;
};
