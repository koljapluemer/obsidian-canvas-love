import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import DrawnGrid from '../../DrawnGrid';

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
        
        // Compare with expected output
        expect(actualOutputJson).to.deep.equal(expectedOutputJson);
    });
});
