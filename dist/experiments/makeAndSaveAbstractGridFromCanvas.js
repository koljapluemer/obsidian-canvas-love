"use strict";
exports.__esModule = true;
/// <reference types="node" />
var fs_1 = require("fs");
var AbstractGrid_1 = require("../classes/grids/abstract/AbstractGrid");
// Configuration
var INPUT_FILE = 'src/experiments/data/simple/openjson.canvas';
var OUTPUT_FILE = 'src/experiments/data/simple/abstractGrid.json';
function main() {
    try {
        // Read and parse the canvas file
        var canvasData = JSON.parse((0, fs_1.readFileSync)(INPUT_FILE, 'utf8'));
        // Generate the abstract grid
        var grid = AbstractGrid_1["default"].generateFromCanvasData(canvasData);
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
