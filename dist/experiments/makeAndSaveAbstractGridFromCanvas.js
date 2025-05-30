"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
var fs_1 = require("fs");
var jsoncanvas_1 = require("@trbn/jsoncanvas");
var AbstractGrid_1 = require("../classes/grids/abstract/AbstractGrid");
// Configuration
var INPUT_FILE = 'src/experiments/data/simple/openjson.canvas';
var OUTPUT_FILE = 'src/experiments/data/simple/abstractGrid.json';
function main() {
    try {
        // Read and parse the canvas file
        var canvasData = JSON.parse((0, fs_1.readFileSync)(INPUT_FILE, 'utf8'));
        console.log('Canvas data:', JSON.stringify(canvasData, null, 2));
        var canvas = new jsoncanvas_1.JSONCanvas(canvasData);
        console.log('Canvas nodes:', canvas.getNodes());
        console.log('Canvas edges:', canvas.getEdges());
        // Generate the abstract grid
        var grid = AbstractGrid_1.default.generateFromCanvasData(canvas);
        // Save the grid to JSON
        var gridJSON = grid.saveToJSON();
        (0, fs_1.writeFileSync)(OUTPUT_FILE, JSON.stringify(gridJSON, null, 2));
        console.log("Successfully processed canvas and saved grid to ".concat(OUTPUT_FILE));
        console.log("Generated ".concat(grid.nodes.length, " nodes and ").concat(grid.edges.length, " edges"));
    }
    catch (error) {
        console.error('Error processing canvas:', error);
    }
}
main();
