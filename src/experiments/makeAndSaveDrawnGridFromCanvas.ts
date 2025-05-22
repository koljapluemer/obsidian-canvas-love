import { readFileSync, writeFileSync } from 'fs';
import { JSONCanvas } from '@trbn/jsoncanvas';
import AbstractGrid from '../classes/grids/abstract/AbstractGrid';
import ConfiguredGrid from '../classes/grids/configured/ConfiguredGrid';
import DrawnGrid from '../classes/grids/drawn/DrawnGrid';

// Configuration
const INPUT_FILE = 'src/experiments/data/simple/openjson.canvas';
const OUTPUT_FILE = 'src/experiments/data/simple/drawnGrid.json';

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
        
        // Generate the drawn grid
        const drawnGrid = new DrawnGrid(configuredGrid);
        console.log(`Generated drawn grid with ${drawnGrid.nodes.length} nodes and ${drawnGrid.edges.length} edges`);

        // Save the drawn grid to JSON
        const gridJSON = drawnGrid.saveToJSON();
        writeFileSync(OUTPUT_FILE, JSON.stringify(gridJSON, null, 2));
        console.log(`Successfully saved drawn grid to ${OUTPUT_FILE}`);

        // Render the grid as ASCII and print to stdout
        console.log('ASCII rendering of the drawn grid:');
        console.log(drawnGrid.renderAsASCII());
    } catch (error) {
        console.error('Error processing canvas:', error);
    }
}

main();
