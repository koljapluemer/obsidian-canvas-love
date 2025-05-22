/// <reference types="node" />
import { readFileSync, writeFileSync } from 'fs';
import { JSONCanvas } from '@trbn/jsoncanvas';
import AbstractGrid from '../classes/grids/abstract/AbstractGrid';

// Configuration
const INPUT_FILE = 'src/experiments/data/simple/openjson.canvas';
const OUTPUT_FILE = 'src/experiments/data/simple/abstractGrid.json';

function main() {
    try {
        // Read and parse the canvas file
        const canvasData = JSON.parse(readFileSync(INPUT_FILE, 'utf8'));
        console.log('Canvas data:', JSON.stringify(canvasData, null, 2));
        
        const canvas = new JSONCanvas(canvasData);
        console.log('Canvas nodes:', canvas.getNodes());
        console.log('Canvas edges:', canvas.getEdges());
        
        // Generate the abstract grid
        const grid = AbstractGrid.generateFromCanvasData(canvas);
        
        // Save the grid to JSON
        const gridJSON = grid.saveToJSON();
        writeFileSync(OUTPUT_FILE, JSON.stringify(gridJSON, null, 2));
        
        console.log(`Successfully processed canvas and saved grid to ${OUTPUT_FILE}`);
        console.log(`Generated ${grid.nodes.length} nodes and ${grid.edges.length} edges`);
    } catch (error) {
        console.error('Error processing canvas:', error);
    }
}

main();
