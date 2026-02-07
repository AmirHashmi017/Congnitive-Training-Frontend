import type { ShapeAttributes, GameRule } from '../types';
import { ShapeFactory } from './shapeFactory';
import { OBJECT_ICONS, COMPLEX_ICONS } from './constants';

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
    { id: '5', description: 'Same shape but not same color', matchType: 'same_shape_diff_color' },
    { id: '6', description: 'Same color but not same shape', matchType: 'same_color_diff_shape' },
    { id: '7', description: 'Identical: Same shape and color', matchType: 'same_shape_same_color' },
    { id: '8', description: 'Match the same number', matchType: 'same_value' },
    { id: '9', description: 'Same color but not same number', matchType: 'same_color_diff_value' },
    { id: '10', description: 'Same number but not same color', matchType: 'same_value_diff_color' },
    { id: '11', description: 'Same shape but not same number', matchType: 'same_shape_diff_value' },
    { id: '12', description: 'Same number but not same shape', matchType: 'same_value_diff_shape' },
    { id: '13', description: 'Same color and shape but not same number', matchType: 'same_color_same_shape_diff_value' },
    { id: '14', description: 'Same shape and number but not same color', matchType: 'same_shape_same_value_diff_color' },
    { id: '15', description: 'Same color and number but not same shape', matchType: 'same_color_same_value_diff_shape' },
    { id: '16', description: 'Perfect Match: Shape, Color, and Number', matchType: 'triple_match' },
    // New Rules for Levels 8-11
    { id: '17', description: 'Find the described object', matchType: 'word_match' },
    { id: '18', description: 'Match the pattern', matchType: 'pattern_match' },
    { id: '19', description: 'Identify the object', matchType: 'object_id' },
    { id: '20', description: 'Match the complex shape', matchType: 'complex_match' },
];

/**
 * Core Solver Engine: Generates exactly one correct answer and 3 smart distractors
 */
// Helper for Color Names
const getColorName = (color: string): string => {
    // Basic mapping, can be expanded
    const map: Record<string, string> = {
        '#58cc02': 'Green',
        '#1cb0f6': 'Blue',
        '#ff4b4b': 'Red',
        '#ffc800': 'Yellow',
        '#ce82ff': 'Purple',
        '#ff9600': 'Orange',
        '#ff89bb': 'Pink',
        '#a05a2c': 'Brown',
        '#545454': 'Grey',
        '#333': 'Black',
        'transparent': 'None'
    };
    // If exact hex match, return name. Else try to find closest or default to "Color"
    // For this app, we strictly use the palette from ShapeFactory (which needs to be consistent)
    // Assuming ShapeFactory generates these specific colors.
    return map[color] || 'Color';
};

/**
 * Core Solver Engine: Generates exactly one correct answer and 3 smart distractors
 */
export const generatePuzzle = (rule: GameRule): { target: ShapeAttributes, options: ShapeAttributes[], correctIndex: number, rule: GameRule, type?: 'standard' | 'word' | 'pattern' | 'object' | 'complex' } => {

    // --- LEVEL 8: SPECIALIST (Complex Icon -> Icon, Same Color) ---
    if (rule.matchType === 'complex_match') {
        const correctIcon = COMPLEX_ICONS[Math.floor(Math.random() * COMPLEX_ICONS.length)];
        const correctColor = ShapeFactory.generateRandomShape().color;

        const target: ShapeAttributes = {
            type: 'icon',
            iconName: correctIcon,
            color: correctColor,
            size: 1,
            rotation: 0
        };

        const correctOption = { ...target };
        const options = [correctOption];

        while (options.length < 4) {
            // Options SHARE same color as target (to make it harder, focus on shape)
            // Distractor: Different Icon, Same Color
            let dIconName = correctIcon;

            // Keep picking until we find one that is NOT the correct icon AND not already in options
            let attempts = 0;
            while (
                (dIconName === correctIcon || options.some(o => o.iconName === dIconName)) &&
                attempts < 100
            ) {
                dIconName = COMPLEX_ICONS[Math.floor(Math.random() * COMPLEX_ICONS.length)];
                attempts++;
            }

            const dOption: ShapeAttributes = {
                type: 'icon',
                iconName: dIconName,
                color: correctColor, // STRICTLY SAME COLOR
                size: 1,
                rotation: 0
            };

            if (!options.some(o => o.iconName === dOption.iconName)) {
                options.push(dOption);
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.indexOf(correctOption), rule, type: 'complex' };
    }

    // --- LEVEL 9: LINGUIST (Word Match: Text -> Shape) ---
    if (rule.matchType === 'word_match') {
        const correctShape = ShapeFactory.generateRandomShape();
        delete (correctShape as any).value;
        const colorName = getColorName(correctShape.color);
        const description = `Find the ${colorName} ${correctShape.type}`;

        const target: ShapeAttributes = {
            type: 'text',
            contentValue: description,
            color: '#333',
            size: 1,
            rotation: 0
        };

        const options = [correctShape];
        while (options.length < 4) {
            const d = ShapeFactory.generateRandomShape();
            delete (d as any).value;
            // Ensure variety in options
            if (!options.some(o => o.color === d.color && o.type === d.type)) {
                options.push(d);
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.indexOf(correctShape), rule, type: 'word' };
    }

    // --- LEVEL 10: PATTERNIST (Pattern Match: Pattern -> Pattern) ---
    if (rule.matchType === 'pattern_match') {
        const baseShape = ShapeFactory.generateRandomShape();
        delete (baseShape as any).value;
        const count = Math.floor(Math.random() * 3) + 2;

        const target: ShapeAttributes = {
            type: 'pattern',
            count,
            subShapes: Array(count).fill(baseShape),
            color: 'transparent',
            size: 1.2,
            rotation: 0
        };

        const correctOption = { ...target };
        const options = [correctOption];

        while (options.length < 4) {
            // Distractors: MUST have different colors/shapes to avoid confusion
            // "don't give any similar color of question in options"
            const mode = Math.random();
            let dBase = { ...baseShape };
            delete (dBase as any).value;
            let dCount = count;

            // Enforce different color for distractors
            dBase = ShapeFactory.generateShape({ type: baseShape.type });
            while (dBase.color === baseShape.color) dBase = ShapeFactory.generateShape({ type: baseShape.type });
            delete (dBase as any).value;

            if (mode < 0.5) {
                // Change count + diff color
                dCount = count === 2 ? 3 : 2;
            } else {
                // Change shape + diff color
                // const newType = dBase.type; // already changed color above
                // Ensure shape is also different from target if possible, or just rely on color
            }

            const dOption: ShapeAttributes = {
                type: 'pattern',
                count: dCount,
                subShapes: Array(dCount).fill(dBase),
                color: 'transparent',
                size: 1.2,
                rotation: 0
            };

            if (!options.some(o => JSON.stringify(o.subShapes) === JSON.stringify(dOption.subShapes))) {
                options.push(dOption);
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.findIndex(o => JSON.stringify(o) === JSON.stringify(correctOption)), rule, type: 'pattern' };
    }

    // --- LEVEL 11: VISIONARY (Object ID: Icon -> Text) ---
    if (rule.matchType === 'object_id') {
        const correctIcon = OBJECT_ICONS[Math.floor(Math.random() * OBJECT_ICONS.length)];

        const target: ShapeAttributes = {
            type: 'icon',
            iconName: correctIcon,
            color: ShapeFactory.generateRandomShape().color,
            size: 1,
            rotation: 0
        };

        const correctOption: ShapeAttributes = {
            type: 'text',
            contentValue: correctIcon.charAt(0).toUpperCase() + correctIcon.slice(1),
            color: '#333',
            size: 1,
            rotation: 0
        };

        const options = [correctOption];
        const usedIcons = [correctIcon];

        while (options.length < 4) {
            const dIcon = OBJECT_ICONS[Math.floor(Math.random() * OBJECT_ICONS.length)];
            if (!usedIcons.includes(dIcon)) {
                usedIcons.push(dIcon);
                options.push({
                    type: 'text',
                    contentValue: dIcon.charAt(0).toUpperCase() + dIcon.slice(1),
                    color: '#333',
                    size: 1,
                    rotation: 0
                });
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        // Correct index finding MUST be precise
        const correctIdx = shuffled.findIndex(o => o.contentValue === correctOption.contentValue);

        return { target, options: shuffled, correctIndex: correctIdx, rule, type: 'object' };
    }

    // --- STANDARD LEVELS (1-7) ---
    const target = ShapeFactory.generateRandomShape();
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
        'not_value',
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
        delete (target as any).value;
        shuffled.forEach(opt => delete (opt as any).value);
    }

    return { target, options: shuffled, correctIndex, rule, type: 'standard' };
};

/**
 * Returns rules based on the user's current Level (1-12)
 */
export const getRulesByLevel = (level: number): GameRule[] => {
    let allowedTypes: string[] = [];

    switch (level) {
        case 1: // Color Matcher
            allowedTypes = ['color'];
            break;
        case 2: // Shape Sorter
            allowedTypes = ['shape'];
            break;
        case 3: // Number Ninja
            allowedTypes = ['same_value'];
            break;
        case 4: // Dualist (Strict Compound: Color/Shape)
            allowedTypes = ['same_shape_diff_color', 'same_color_diff_shape', 'same_shape_same_color'];
            break;
        case 5: // Spectrum (Strict Compound: Color/Number)
            allowedTypes = ['same_color_diff_value', 'same_value_diff_color', 'same_color_same_value_diff_shape'];
            break;
        case 6: // Morpher (Strict Compound: Shape/Number)
            allowedTypes = ['same_shape_diff_value', 'same_value_diff_shape', 'same_shape_same_value_diff_color'];
            break;
        case 7: // Mastermind (Strict Compound: All 3)
            allowedTypes = [
                'triple_match',
                'same_color_same_shape_diff_value',
                'same_shape_same_value_diff_color',
                'same_color_same_value_diff_shape'
            ];
            break;
        case 8: // Specialist (Complex Icon -> Icon)
            allowedTypes = ['complex_match'];
            break;
        case 9: // Linguist (Text -> Shape)
            allowedTypes = ['word_match'];
            break;
        case 10: // Patternist (Pattern -> Pattern)
            allowedTypes = ['pattern_match'];
            break;
        case 11: // Visionary (Icon -> Text)
            allowedTypes = ['object_id'];
            break;
        case 12: // Infinity (Random Mix of ALL)
            allowedTypes = RULE_POOL.map(r => r.matchType);
            break;
        default:
            allowedTypes = RULE_POOL.map(r => r.matchType);
            break;
    }

    return RULE_POOL.filter(rule => allowedTypes.includes(rule.matchType));
};

/**
 * @deprecated Use getRulesByLevel instead
 */
export const getRulesByXP = (_xp: number): GameRule[] => {
    return getRulesByLevel(1); // Default safe fallback
};
