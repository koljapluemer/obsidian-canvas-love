import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import DrawnGrid from '../../DrawnGrid';

function printDiff(a: any, b: any, path: string[] = []) {
    if (typeof a !== typeof b) {
        console.log(`Type mismatch at ${path.join('.')}: ${typeof a} vs ${typeof b}`);
        return;
    }
    if (typeof a !== 'object' || a === null || b === null) {
        if (a !== b) {
            console.log(`Value mismatch at ${path.join('.')}: ${a} vs ${b}`);
        }
        return;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const key of new Set([...aKeys, ...bKeys])) {
        if (!(key in a)) {
            console.log(`Missing in actual at ${[...path, key].join('.')}`);
            continue;
        }
        if (!(key in b)) {
            console.log(`Missing in expected at ${[...path, key].join('.')}`);
            continue;
        }
        printDiff(a[key], b[key], [...path, key]);
    }
}

describe('DrawnGrid Serialization', () => {
    it('should load from JSON and save back to the same format', () => {
        // Read input JSON
        const inputPath = path.join(__dirname, 'in.json');
        const outputPath = path.join(__dirname, 'out.json');
        
        const inputJson = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        const expectedOutputJson = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        
        // Create DrawnGrid from input
        const grid = DrawnGrid.makeFromJSON(inputJson);
        
        // Save back to JSON
        const actualOutputJson = grid.saveToJSON();
        
        // Debug: print diff if not equal
        try {
            expect(actualOutputJson).to.deep.equal(expectedOutputJson);
        } catch (e) {
            console.log('=== ACTUAL OUTPUT ===');
            console.dir(actualOutputJson, { depth: null });
            console.log('=== EXPECTED OUTPUT ===');
            console.dir(expectedOutputJson, { depth: null });
            console.log('=== DIFF ===');
            printDiff(actualOutputJson, expectedOutputJson);
            throw e;
        }
    });
});
