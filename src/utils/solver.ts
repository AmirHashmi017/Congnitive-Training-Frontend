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
        case 'same_shape_same_color':
            return target.type === option.type && target.color === option.color;
        case 'same_value':
            return target.value === option.value;
        case 'not_value':
            return target.value !== option.value;
        case 'same_color_diff_value':
            return target.color === option.color && target.value !== option.value;
        case 'same_value_diff_color':
            return target.value === option.value && target.color !== option.color;
        case 'same_shape_diff_value':
            return target.type === option.type && target.value !== option.value;
        case 'same_value_diff_shape':
            return target.value === option.value && target.type !== option.type;
        case 'triple_match':
            return target.type === option.type && target.color === option.color && target.value === option.value;
        case 'same_color_same_shape_diff_value':
            return target.type === option.type && target.color === option.color && target.value !== option.value;
        case 'same_shape_same_value_diff_color':
            return target.type === option.type && target.value === option.value && target.color !== option.color;
        case 'same_color_same_value_diff_shape':
            return target.color === option.color && target.value === option.value && target.type !== option.type;
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
    { id: '7', description: 'Identical: Same shape and color', matchType: 'same_shape_same_color' },
    { id: '8', description: 'Match the same number', matchType: 'same_value' },
    { id: '17', description: 'Find a DIFFERENT number', matchType: 'not_value' },
    { id: '9', description: 'Same color but different number', matchType: 'same_color_diff_value' },
    { id: '10', description: 'Same number but different color', matchType: 'same_value_diff_color' },
    { id: '11', description: 'Same shape but different number', matchType: 'same_shape_diff_value' },
    { id: '12', description: 'Same number but different shape', matchType: 'same_value_diff_shape' },
    { id: '13', description: 'Same color and shape but different number', matchType: 'same_color_same_shape_diff_value' },
    { id: '14', description: 'Same shape and number but different color', matchType: 'same_shape_same_value_diff_color' },
    { id: '15', description: 'Same color and number but different shape', matchType: 'same_color_same_value_diff_shape' },
    { id: '16', description: 'Perfect Match: Shape, Color, and Number', matchType: 'triple_match' },
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
            correctOption = ShapeFactory.generateShape({ type: target.type });
            while (correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ type: target.type });
            }
            break;
        case 'not_shape':
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
        case 'same_shape_same_color':
            correctOption = ShapeFactory.generateShape({ type: target.type, color: target.color });
            break;
        case 'same_value':
            correctOption = ShapeFactory.generateShape({ value: target.value });
            while (correctOption.type === target.type && correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ value: target.value });
            }
            break;
        case 'not_value':
            correctOption = ShapeFactory.generateShape({ type: target.type, color: target.color });
            while (correctOption.value === target.value) {
                correctOption = ShapeFactory.generateShape({ type: target.type, color: target.color });
            }
            break;
        case 'same_color_diff_value':
            correctOption = ShapeFactory.generateShape({ color: target.color });
            while (correctOption.value === target.value) {
                correctOption = ShapeFactory.generateShape({ color: target.color });
            }
            break;
        case 'same_value_diff_color':
            correctOption = ShapeFactory.generateShape({ value: target.value });
            while (correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ value: target.value });
            }
            break;
        case 'same_shape_diff_value':
            correctOption = ShapeFactory.generateShape({ type: target.type });
            while (correctOption.value === target.value) {
                correctOption = ShapeFactory.generateShape({ type: target.type });
            }
            break;
        case 'same_value_diff_shape':
            correctOption = ShapeFactory.generateShape({ value: target.value });
            while (correctOption.type === target.type) {
                correctOption = ShapeFactory.generateShape({ value: target.value });
            }
            break;
        case 'same_color_same_shape_diff_value':
            correctOption = ShapeFactory.generateShape({ type: target.type, color: target.color });
            while (correctOption.value === target.value) {
                correctOption = ShapeFactory.generateShape({ type: target.type, color: target.color });
            }
            break;
        case 'same_shape_same_value_diff_color':
            correctOption = ShapeFactory.generateShape({ type: target.type, value: target.value });
            while (correctOption.color === target.color) {
                correctOption = ShapeFactory.generateShape({ type: target.type, value: target.value });
            }
            break;
        case 'same_color_same_value_diff_shape':
            correctOption = ShapeFactory.generateShape({ color: target.color, value: target.value });
            while (correctOption.type === target.type) {
                correctOption = ShapeFactory.generateShape({ color: target.color, value: target.value });
            }
            break;
        case 'triple_match':
            correctOption = ShapeFactory.generateShape({ type: target.type, color: target.color, value: target.value });
            break;
        default:
            correctOption = { ...target };
    }

    const options: ShapeAttributes[] = [correctOption];

    // 2. Generate 3 distractors that MUST NOT satisfy the rule
    // We also include "TRAPS" - shapes that share many attributes with the target but fail the rule
    const trapThreshold = 0.6; // High chance to try to generate a specific trap

    while (options.length < 4) {
        let candidate: ShapeAttributes;

        if (Math.random() < trapThreshold) {
            // Attempt to create a "trap" based on the rule
            switch (rule.matchType) {
                case 'same_color_diff_shape':
                case 'same_shape_diff_color':
                case 'same_color_diff_value':
                case 'same_value_diff_color':
                case 'same_shape_diff_value':
                case 'same_value_diff_shape':
                case 'same_color_same_shape_diff_value':
                case 'same_shape_same_value_diff_color':
                case 'same_color_same_value_diff_shape':
                    // Trap for "diff" rules: create an IDENTICAL shape that violates the rule
                    candidate = ShapeFactory.generateShape({ color: target.color, type: target.type, value: target.value });
                    break;
                case 'not_value':
                    // Trap: same value (identical shape)
                    candidate = ShapeFactory.generateShape({ color: target.color, type: target.type, value: target.value });
                    break;
                case 'triple_match':
                    // Trap for triple match: share 2 out of 3 attributes
                    const rand = Math.random();
                    if (rand < 0.33) {
                        candidate = ShapeFactory.generateShape({ type: target.type, color: target.color }); // diff value
                    } else if (rand < 0.66) {
                        candidate = ShapeFactory.generateShape({ type: target.type, value: target.value }); // diff color
                    } else {
                        candidate = ShapeFactory.generateShape({ color: target.color, value: target.value }); // diff shape
                    }
                    break;
                default:
                    candidate = ShapeFactory.generateRandomShape();
            }
        } else {
            candidate = ShapeFactory.generateRandomShape();
        }

        const isCorrect = checkMatch(target, candidate, rule);

        const isDuplicate = options.some(o =>
            o.color === candidate.color &&
            o.type === candidate.type &&
            o.value === candidate.value &&
            Math.abs(o.size - candidate.size) < 0.1
        );

        if (!isCorrect && !isDuplicate) {
            options.push(candidate);
        }
    }

    const shuffled = [...options].sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.findIndex(o => o === correctOption);

    // 3. Post-process: Remove numeric values if they are not relevant to the rule
    const numericRules = [
        'same_value',
        'same_color_diff_value',
        'same_value_diff_color',
        'same_shape_diff_value',
        'same_value_diff_shape',
        'triple_match',
        'same_color_same_shape_diff_value',
        'same_shape_same_value_diff_color',
        'same_color_same_value_diff_shape'
    ];

    if (!numericRules.includes(rule.matchType)) {
        // Strip values for display
        delete target.value;
        shuffled.forEach(opt => delete opt.value);
    }

    return { target, options: shuffled, correctIndex, rule };
};

/**
 * Returns a subset of rules based on the user's current XP
 */
export const getRulesByXP = (xp: number): GameRule[] => {
    if (xp >= 400) return RULE_POOL;

    let allowedTypes: string[] = [];

    if (xp < 50) {
        allowedTypes = ['color', 'not_color'];
    } else if (xp < 100) {
        allowedTypes = ['shape', 'not_shape'];
    } else if (xp < 150) {
        allowedTypes = ['same_value', 'not_value'];
    } else if (xp < 200) {
        allowedTypes = ['same_shape_diff_color', 'same_color_diff_shape', 'same_shape_same_color'];
    } else if (xp < 250) {
        allowedTypes = ['same_color_diff_value', 'same_value_diff_color'];
    } else if (xp < 300) {
        allowedTypes = ['same_shape_diff_value', 'same_value_diff_shape'];
    } else {
        allowedTypes = [
            'triple_match',
            'same_color_same_shape_diff_value',
            'same_shape_same_value_diff_color',
            'same_color_same_value_diff_shape'
        ];
    }

    return RULE_POOL.filter(rule => allowedTypes.includes(rule.matchType));
};
