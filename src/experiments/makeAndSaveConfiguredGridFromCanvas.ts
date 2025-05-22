/// <reference types="node" />
import { readFileSync, writeFileSync } from 'fs';
import { JSONCanvas } from '@trbn/jsoncanvas';
import AbstractGrid from '../classes/grids/abstract/AbstractGrid';
import ConfiguredGrid from '../classes/grids/configured/ConfiguredGrid';

// Configuration
const INPUT_FILE = 'src/experiments/data/simple/openjson.canvas';
const OUTPUT_FILE = 'src/experiments/data/simple/configuredGrid.json';

function main() {
    try {
        // Read and parse the canvas file
        const canvasData = JSON.parse(readFileSync(INPUT_FILE, 'utf8'));
        console.log('Canvas data:', JSON.stringify(canvasData, null, 2));
        
        const canvas = new JSONCanvas(canvasData);
        console.log('Canvas nodes:', canvas.getNodes());
        console.log('Canvas edges:', canvas.getEdges());
        
        // Generate the abstract grid
        const abstractGrid = AbstractGrid.generateFromCanvasData(canvas);
        console.log(`Generated abstract grid with ${abstractGrid.nodes.length} nodes and ${abstractGrid.edges.length} edges`);
        
        // Generate the configured grid
        const configuredGrid = ConfiguredGrid.generateRandomizedFromAbstractGrid(abstractGrid);
        console.log(`Generated configured grid with ${configuredGrid.nodes.length} nodes and ${configuredGrid.edges.length} edges`);
        
        // Save the configured grid to JSON
        const gridJSON = configuredGrid.saveToJSON();
        writeFileSync(OUTPUT_FILE, JSON.stringify(gridJSON, null, 2));
        
        console.log(`Successfully saved configured grid to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error processing canvas:', error);
    }
}

main();
