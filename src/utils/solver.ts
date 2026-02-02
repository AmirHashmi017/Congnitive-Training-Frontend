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
        case 'not_color':
            return target.color !== option.color;
        case 'not_shape':
            return target.type !== option.type;
        case 'same_shape_diff_color':
            return target.type === option.type && target.color !== option.color;
        case 'same_color_diff_shape':
            return target.color === option.color && target.type !== option.type;
        default:
            return false;
    }
};

export const RULE_POOL: GameRule[] = [
    { id: '1', description: 'Match the same color', matchType: 'color' },
    { id: '2', description: 'Match the same shape', matchType: 'shape' },
    { id: '3', description: 'Find a DIFFERENT color', matchType: 'not_color' },
    { id: '4', description: 'Find a DIFFERENT shape', matchType: 'not_shape' },
    { id: '5', description: 'Same shape but different color', matchType: 'same_shape_diff_color' },
    { id: '6', description: 'Same color but not same shape', matchType: 'same_color_diff_shape' },
];

/**
 * Core Solver Engine: Generates exactly one correct answer and 3 smart distractors
 */
export const generatePuzzle = (rule: GameRule): { target: ShapeAttributes, options: ShapeAttributes[], correctIndex: number, rule: GameRule } => {
    const target = ShapeFactory.generateRandomShape();

    // 1. Generate the TRUE correct answer based on the rule
    let correctOption: ShapeAttributes;

    switch (rule.matchType) {
        case 'color':
            correctOption = ShapeFactory.generateShape({ color: target.color });
            while (correctOption.type === target.type) {
                correctOption = ShapeFactory.generateShape({ color: target.color });
            }
            break;
        case 'shape':
            correctOption = ShapeFactory.generateShape({ type: target.type });
            while (correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ type: target.type });
            }
            break;
        case 'not_color':
            // Logic for "Find a DIFFERENT color": 
            // Correct option must have a different color. 
            // We'll keep the shape the same initially to make it a direct comparison.
            correctOption = ShapeFactory.generateShape({ type: target.type });
            while (correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ type: target.type });
            }
            break;
        case 'not_shape':
            // Logic for "Find a DIFFERENT shape":
            // Correct option must have a different shape.
            // We'll keep the color the same initially.
            correctOption = ShapeFactory.generateShape({ color: target.color });
            while (correctOption.type === target.type) {
                correctOption = ShapeFactory.generateShape({ color: target.color });
            }
            break;
        case 'same_shape_diff_color':
            correctOption = ShapeFactory.generateShape({ type: target.type });
            while (correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ type: target.type });
            }
            break;
        case 'same_color_diff_shape':
            correctOption = ShapeFactory.generateShape({ color: target.color });
            while (correctOption.type === target.type) {
                correctOption = ShapeFactory.generateShape({ color: target.color });
            }
            break;
        default:
            correctOption = { ...target };
    }

    const options: ShapeAttributes[] = [correctOption];

    // 2. Generate 3 distractors that MUST NOT satisfy the rule
    while (options.length < 4) {
        const candidate = ShapeFactory.generateRandomShape();
        const isCorrect = checkMatch(target, candidate, rule);

        const isDuplicate = options.some(o =>
            o.color === candidate.color &&
            o.type === candidate.type &&
            Math.abs(o.size - candidate.size) < 0.1
        );

        if (!isCorrect && !isDuplicate) {
            options.push(candidate);
        }
    }

    const shuffled = [...options].sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.findIndex(o => o === correctOption);

    return { target, options: shuffled, correctIndex, rule };
};
