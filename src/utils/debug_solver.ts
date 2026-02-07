
import { generatePuzzle, getRulesByLevel } from './solver';

const runTest = () => {
    console.log('Testing Level 11 Correctness...');
    const rules = getRulesByLevel(11);
    if (rules.length === 0) {
        console.error('No rules for Level 11');
        return;
    }

    const rule = rules[0];

    for (let i = 0; i < 5; i++) {
        const puzzle = generatePuzzle(rule);
        console.log(`\nRound ${i + 1}:`);
        console.log(`Target Icon: ${puzzle.target.iconName}`);

        const correctOpt = puzzle.options[puzzle.correctIndex];
        console.log(`Correct Index: ${puzzle.correctIndex}`);
        console.log(`Option at CorrectIndex: ${correctOpt.contentValue}`);

        // Verify match
        const iconName = puzzle.target.iconName || '';
        const expectedValue = iconName.charAt(0).toUpperCase() + iconName.slice(1);
        if (correctOpt.contentValue === expectedValue) {
            console.log('MATCH: SUCCESS');
        } else {
            console.error(`MATCH: FAILED. Expected ${expectedValue}, got ${correctOpt.contentValue}`);
        }
    }
};

runTest();
