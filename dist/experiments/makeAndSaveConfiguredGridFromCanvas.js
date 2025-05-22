"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="node" />
var fs_1 = require("fs");
var jsoncanvas_1 = require("@trbn/jsoncanvas");
var AbstractGrid_1 = require("../classes/grids/abstract/AbstractGrid");
var ConfiguredGrid_1 = require("../classes/grids/configured/ConfiguredGrid");
// Configuration
var INPUT_FILE = 'src/experiments/data/simple/openjson.canvas';
var OUTPUT_FILE = 'src/experiments/data/simple/configuredGrid.json';
function main() {
    try {
        // Read and parse the canvas file
        var canvasData = JSON.parse((0, fs_1.readFileSync)(INPUT_FILE, 'utf8'));
        console.log('Canvas data:', JSON.stringify(canvasData, null, 2));
        var canvas = new jsoncanvas_1.JSONCanvas(canvasData);
        console.log('Canvas nodes:', canvas.getNodes());
        console.log('Canvas edges:', canvas.getEdges());
        // Generate the abstract grid
        var abstractGrid = AbstractGrid_1.default.generateFromCanvasData(canvas);
        console.log("Generated abstract grid with ".concat(abstractGrid.nodes.length, " nodes and ").concat(abstractGrid.edges.length, " edges"));
        // Generate the configured grid
        var configuredGrid = ConfiguredGrid_1.default.generateRandomizedFromAbstractGrid(abstractGrid);
        console.log("Generated configured grid with ".concat(configuredGrid.nodes.length, " nodes and ").concat(configuredGrid.edges.length, " edges"));
        // Save the configured grid to JSON
        var gridJSON = configuredGrid.saveToJSON();
        (0, fs_1.writeFileSync)(OUTPUT_FILE, JSON.stringify(gridJSON, null, 2));
        console.log("Successfully saved configured grid to ".concat(OUTPUT_FILE));
    }
    catch (error) {
        console.error('Error processing canvas:', error);
    }
}
main();
