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
        case 'simple_word_match':
            // Logic: Target (Instruction) matches Option (Shape) by color
            return target.contentValue?.includes(getColorName(option.color)) || false;
        case 'complex_match':
            // Match complex shapes by icon pattern AND inner pattern variation
            return target.iconName === option.iconName && target.innerPattern === option.innerPattern;
        case 'irregular_shape_match':
            // Match irregular shapes by type AND require a significant rotation difference
            // so tiny tilt distractors are not counted as correct.
            if (target.type !== option.type) return false;
            // Normalize angle difference to [-180,180]
            const angDiff = Math.abs(((target.rotation - option.rotation + 180) % 360) - 180);
            const MIN_ROTATION_DIFF = 20; // degrees
            return angDiff >= MIN_ROTATION_DIFF;
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
    { id: '18', description: 'Match the pattern', matchType: 'pattern_match' },
    { id: '19', description: 'Identify the object', matchType: 'object_id' },
    { id: '20', description: 'Match the complex shape', matchType: 'complex_match' },
    { id: '21', description: ' ', matchType: 'simple_word_match' },
    { id: '22', description: 'Match the irregular shape', matchType: 'irregular_shape_match' },
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

    // --- LEVEL 2: SIMPLE LINGUIST (Simple Word Match: "Find the one that is the same color as [COLOR]") ---
    if (rule.matchType === 'simple_word_match') {
        const correctShape = ShapeFactory.generateRandomShape();
        delete (correctShape as any).value;
        const colorName = getColorName(correctShape.color).toUpperCase();

        // " Find the one that is the same color as BLUE"
        const description = `Find the one that is the same color as ${colorName}`;

        const target: ShapeAttributes = {
            type: 'text',
            contentValue: description,
            color: '#333',
            size: 1,
            rotation: 0
        };

        const options = [correctShape];
        while (options.length < 4) {
            // Distractors: Must be DIFFERENT color
            const d = ShapeFactory.generateRandomShape();
            delete (d as any).value;
            // Ensure variety in options AND STRICTLY different color for distractors
            if (d.color !== correctShape.color && !options.some(o => o.color === d.color)) {
                options.push(d);
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.indexOf(correctShape), rule, type: 'word' };
    }

    // --- LEVEL 10: SPECIALIST (Complex Match: Concentric Circles with INNER PATTERN variations) ---
    if (rule.matchType === 'complex_match') {
        // ONLY use concentric circle icons
        const concentricIcons = ['target', 'circle-dot', 'aperture', 'compass'];
        // Inner pattern variations: different number of dots or ring styles
        const innerPatterns = ['1-dot', '2-dots', '3-dots', 'thick-ring', 'thin-ring'];
        
        const correctIcon = concentricIcons[Math.floor(Math.random() * concentricIcons.length)];
        const correctInnerPattern = innerPatterns[Math.floor(Math.random() * innerPatterns.length)];

        // Pick a visible target color (for display) and ensure NONE of the options use that color
        const targetColor = ShapeFactory.generateRandomShape().color;
        // Pick an answer color that is different from the displayed target color so players
        // cannot match by color alone. Also reserve used colors to avoid repeats.
        let correctOptionColor = ShapeFactory.generateRandomShape().color;
        while (correctOptionColor === targetColor) {
            correctOptionColor = ShapeFactory.generateRandomShape().color;
        }

        const target: ShapeAttributes = {
            type: 'icon',
            iconName: correctIcon,
            innerPattern: correctInnerPattern,
            color: targetColor,
            size: 1,
            rotation: 0
        };

        // The correct option must share the iconName and innerPattern but intentionally use
        // a different color than the displayed target so matching cannot be done by color.
        const correctOption: ShapeAttributes = {
            type: 'icon',
            iconName: correctIcon,
            innerPattern: correctInnerPattern,
            color: correctOptionColor,
            size: 1,
            rotation: 0
        };

        const options = [correctOption];
        // Track used colors (include targetColor and correctOptionColor) to avoid choosing
        // distractors that accidentally match the target color.
        const usedColors = new Set<string>([targetColor, correctOptionColor]);

        // Generate 3 distractors with SUBTLE VARIATIONS (innerPattern), and ensure all distractor
        // colors are different from the target color so players can't match by color alone.
        while (options.length < 4) {
            const distractorMode = Math.random();
            let dIcon: string;
            let dInnerPattern: string;
            let dColor: string;

            // pick a color not already used (so no option shares target color or duplicates)
            do {
                dColor = ShapeFactory.generateRandomShape().color;
            } while (usedColors.has(dColor));
            usedColors.add(dColor);

            if (distractorMode < 0.5 && options.length < 3) {
                // TRAP 1: Same icon, different inner pattern
                dIcon = correctIcon;
                dInnerPattern = innerPatterns[Math.floor(Math.random() * innerPatterns.length)];
                while (dInnerPattern === correctInnerPattern ||
                    options.some(o => o.iconName === dIcon && o.innerPattern === dInnerPattern)) {
                    dInnerPattern = innerPatterns[Math.floor(Math.random() * innerPatterns.length)];
                }
            } else {
                // TRAP 2: Different concentric icon OR same with different pattern
                dIcon = concentricIcons[Math.floor(Math.random() * concentricIcons.length)];
                dInnerPattern = innerPatterns[Math.floor(Math.random() * innerPatterns.length)];

                // Ensure not duplicate
                while ((dIcon === correctIcon && dInnerPattern === correctInnerPattern) ||
                    options.some(o => o.iconName === dIcon && o.innerPattern === dInnerPattern)) {
                    dIcon = concentricIcons[Math.floor(Math.random() * concentricIcons.length)];
                    dInnerPattern = innerPatterns[Math.floor(Math.random() * innerPatterns.length)];
                }
            }

            const dOption: ShapeAttributes = {
                type: 'icon',
                iconName: dIcon,
                innerPattern: dInnerPattern,
                color: dColor,
                size: 1,
                rotation: 0
            };

            // Avoid exact duplicates
            if (!options.some(o => o.iconName === dOption.iconName && o.innerPattern === dOption.innerPattern)) {
                options.push(dOption);
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.indexOf(correctOption), rule, type: 'complex' };
    }

    // --- LEVEL 11: PATTERNIST (Pattern Match: Structure-Based Inference) ---
    if (rule.matchType === 'pattern_match') {
        // Define pattern structures
        const structures = [
            { id: 'all_same', name: 'All Same', generator: (count: number) => Array(count).fill(0) },
            { id: 'two_same_one_diff', name: 'Two Same, One Different', generator: () => [0, 0, 1] },
            { id: 'alternating', name: 'Alternating', generator: () => [0, 1, 0] },
            { id: 'first_last_same', name: 'First and Last Same', generator: () => [0, 1, 0] },
            { id: 'all_different', name: 'All Different', generator: (count: number) => Array.from({ length: count }, (_, i) => i) },
            { id: 'ascending', name: 'Ascending', generator: (count: number) => Array.from({ length: count }, (_, i) => i) },
            { id: 'descending', name: 'Descending', generator: (count: number) => Array.from({ length: count }, (_, i) => count - 1 - i) },
        ];

        // Pick a random structure for target
        const targetStructure = structures[Math.floor(Math.random() * structures.length)];
        const count = targetStructure.id === 'all_same' ? Math.floor(Math.random() * 2) + 3 : 3; // 3-4 for all_same, 3 for others
        const structurePattern = targetStructure.generator(count);

        // Generate pattern content with shapes only
        const generatePatternContent = (pattern: number[]): ShapeAttributes[] => {
            const uniqueValues = [...new Set(pattern)];
            const contentMap: Record<number, ShapeAttributes> = {};

            uniqueValues.forEach(val => {
                const shape = ShapeFactory.generateRandomShape();
                delete (shape as any).value;
                contentMap[val] = shape;
            });

            return pattern.map(p => ({ ...contentMap[p] }));
        };

        const targetSubShapes = generatePatternContent(structurePattern);

        const target: ShapeAttributes = {
            type: 'pattern',
            count: targetSubShapes.length,
            subShapes: targetSubShapes,
            color: 'transparent',
            size: 1.2,
            rotation: 0
        };

        // Generate correct option with SAME structure, DIFFERENT content
        const correctSubShapes = generatePatternContent(structurePattern);
        const correctOption: ShapeAttributes = {
            type: 'pattern',
            count: correctSubShapes.length,
            subShapes: correctSubShapes,
            color: 'transparent',
            size: 1.2,
            rotation: 0
        };

        const options = [correctOption];

        // Generate distractors with DIFFERENT structures, SAME content type
        // Filter out structures that could be ambiguous (e.g., 'alternating' and 'first_last_same' are the same)
        const usedStructureIds = new Set([targetStructure.id]);

        // Mark ambiguous pairs
        if (targetStructure.id === 'alternating') usedStructureIds.add('first_last_same');
        if (targetStructure.id === 'first_last_same') usedStructureIds.add('alternating');
        if (targetStructure.id === 'ascending') usedStructureIds.add('all_different');
        if (targetStructure.id === 'all_different') usedStructureIds.add('ascending');

        const availableStructures = structures.filter(s => !usedStructureIds.has(s.id));

        while (options.length < 4 && availableStructures.length > 0) {
            const distractorStructure = availableStructures.splice(Math.floor(Math.random() * availableStructures.length), 1)[0];
            const dCount = distractorStructure.id === 'all_same' ? Math.floor(Math.random() * 2) + 3 : 3;
            const dPattern = distractorStructure.generator(dCount);
            const dSubShapes = generatePatternContent(dPattern);

            const dOption: ShapeAttributes = {
                type: 'pattern',
                count: dSubShapes.length,
                subShapes: dSubShapes,
                color: 'transparent',
                size: 1.2,
                rotation: 0
            };

            options.push(dOption);
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.findIndex(o => JSON.stringify(o) === JSON.stringify(correctOption)), rule, type: 'pattern' };
    }

    // --- LEVEL 12: IRREGULAR SHAPES (Match irregular shapes with rotation variations) ---
    if (rule.matchType === 'irregular_shape_match') {
        const target = ShapeFactory.generateRandomIrregularShape();

        // Correct option: same shape type, DIFFERENT rotation (subtle tilt), ALWAYS different color
        const MIN_ROTATION_DIFF = 20; // degrees required to count as a match
        const tiltAngles = [15, 30, 45, 60, 75, 105, 120, 135, 150, 165, 195, 210, 225, 240, 255, 285, 300, 315, 330, 345];
        const availableTilts = tiltAngles.filter(t => Math.abs(((t - target.rotation + 180) % 360) - 180) >= MIN_ROTATION_DIFF);
        const correctRotation = availableTilts.length > 0 ? availableTilts[Math.floor(Math.random() * availableTilts.length)] : (target.rotation + 45) % 360;

        // Generate a different color for correct option (NEVER same as target)
        let correctColor = ShapeFactory.generateRandomShape().color;
        while (correctColor === target.color) {
            correctColor = ShapeFactory.generateRandomShape().color;
        }

        const correctOption: ShapeAttributes = {
            type: target.type,
            color: correctColor,
            rotation: correctRotation,
            size: 0.9 + Math.random() * 0.2
        };

        const options = [correctOption];
        const usedShapeTypes = [target.type];

        // Generate 3 distractors with subtle variations:
        // - same type but rotation very close to target (looks similar but incorrect)
        // - or different irregular shapes
        while (options.length < 4) {
            const distractorMode = Math.random();
            let distractor: ShapeAttributes;

            if (distractorMode < 0.5 && options.length < 3) {
                // TRAP 1: Same irregular shape type, SMALL tilt near target
                const smallTilt = target.rotation + (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 10);
                let trapColor = ShapeFactory.generateRandomShape().color;
                while (trapColor === target.color || trapColor === correctColor ||
                    options.some(o => o.color === trapColor && o.type === target.type && Math.abs(o.rotation - smallTilt) < 5)) {
                    trapColor = ShapeFactory.generateRandomShape().color;
                }
                distractor = {
                    type: target.type,
                    color: trapColor,
                    rotation: smallTilt,
                    size: 0.9 + Math.random() * 0.2
                };
            } else {
                // Different irregular shape type (always incorrect)
                distractor = ShapeFactory.generateRandomIrregularShape();

                // Ensure different shape type and not duplicate
                while (usedShapeTypes.includes(distractor.type) ||
                    options.some(o => o.type === distractor.type && o.color === distractor.color && Math.abs(o.rotation - distractor.rotation) < 5)) {
                    distractor = ShapeFactory.generateRandomIrregularShape();
                }
                usedShapeTypes.push(distractor.type);
            }

            // Avoid near-duplicate
            const isDuplicate = options.some(o =>
                o.type === distractor.type &&
                o.color === distractor.color &&
                Math.abs(o.rotation - distractor.rotation) < 2
            );

            if (!isDuplicate) {
                options.push(distractor);
            }
        }

        const shuffled = options.sort(() => Math.random() - 0.5);
        return { target, options: shuffled, correctIndex: shuffled.indexOf(correctOption), rule, type: 'standard' };
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
 * Returns rules based on the user's current Level (1-13)
 */
export const getRulesByLevel = (level: number): GameRule[] => {
    let allowedTypes: string[] = [];

    switch (level) {
        case 1: // Color Matcher
            allowedTypes = ['color'];
            break;
        case 2: // Simple Linguist (NEW: Simple Word Match)
            allowedTypes = ['simple_word_match'];
            break;
        case 3: // Shape Sorter (Shifted L2 -> L3)
            allowedTypes = ['shape'];
            break;
        case 4: // Number Ninja (Shifted L3 -> L4)
            allowedTypes = ['same_value'];
            break;
        case 5: // Visionary (MOVED L11 -> L5)
            allowedTypes = ['object_id'];
            break;
        case 6: // Dualist (Shifted L4 -> L6)
            allowedTypes = ['same_shape_diff_color', 'same_color_diff_shape', 'same_shape_same_color'];
            break;
        case 7: // Spectrum (Shifted L5 -> L7)
            allowedTypes = ['same_color_diff_value', 'same_value_diff_color', 'same_color_same_value_diff_shape'];
            break;
        case 8: // Morpher (Shifted L6 -> L8)
            allowedTypes = ['same_shape_diff_value', 'same_value_diff_shape', 'same_shape_same_value_diff_color'];
            break;
        case 9: // Mastermind (Shifted L7 -> L9)
            allowedTypes = [
                'triple_match',
                'same_color_same_shape_diff_value',
                'same_shape_same_value_diff_color',
                'same_color_same_value_diff_shape'
            ];
            break;
        case 10: // Specialist (Shifted L8 -> L10)
            allowedTypes = ['complex_match'];
            break;
        case 11: // Patternist (Shifted L10 -> L11)
            allowedTypes = ['pattern_match'];
            break;
        case 12: // Irregular Shapes (NEW: Match rotated irregular shapes)
            allowedTypes = ['irregular_shape_match'];
            break;
        case 13: // Infinity (Random Mix of ALL)
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
