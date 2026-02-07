import { generatePuzzle, getRulesByLevel } from './solver';

const testLevels = [4, 8, 9, 10, 11];

testLevels.forEach(level => {
    console.log(`\n--- Testing Level ${level} ---`);
    const rules = getRulesByLevel(level);
    console.log(`Rules: ${rules.map(r => r.matchType).join(', ')}`);

    if (rules.length === 0) {
        console.error('No rules found!');
        return;
    }

    const rule = rules[0];
    const puzzle = generatePuzzle(rule);

    console.log(`Rule: ${rule.matchType}`);
    console.log(`Target Type: ${puzzle.target.type}`);
    if (puzzle.target.type === 'text') console.log(`Text: ${puzzle.target.contentValue}`);
    if (puzzle.target.type === 'icon') console.log(`Icon: ${puzzle.target.iconName}`);
    if (puzzle.target.type === 'pattern') console.log(`Pattern Count: ${puzzle.target.count}`);

    console.log(`Options: ${puzzle.options.length}`);
    console.log(`Correct Index: ${puzzle.correctIndex}`);
    console.log(`Correct Option Type: ${puzzle.options[puzzle.correctIndex].type}`);
});
