"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractEdge_1 = require("./AbstractEdge");
var AbstractNode_1 = require("./AbstractNode");
var AbstractGrid = /** @class */ (function () {
    function AbstractGrid() {
    }
    AbstractGrid.generateFromCanvasData = function (canvas) {
        var grid = new AbstractGrid();
        grid.nodes = [];
        grid.edges = [];
        // Create nodes first
        var nodeMap = new Map();
        var canvasData = canvas.getNodes();
        console.log('Processing nodes:', canvasData.nodes);
        for (var _i = 0, _a = canvasData.nodes; _i < _a.length; _i++) {
            var nodeData = _a[_i];
            console.log('Processing node:', nodeData);
            var node = new AbstractNode_1.default(nodeData);
            nodeMap.set(nodeData.id, node);
            grid.nodes.push(node);
        }
        // Then create edges
        var edges = canvasData.edges;
        console.log('Processing edges:', edges);
        for (var _b = 0, edges_1 = edges; _b < edges_1.length; _b++) {
            var edgeData = edges_1[_b];
            console.log('Processing edge:', edgeData);
            var sender = nodeMap.get(edgeData.fromNode);
            var receiver = nodeMap.get(edgeData.toNode);
            if (!sender || !receiver) {
                console.warn("Skipping edge: Could not find nodes for edge from ".concat(edgeData.fromNode, " to ").concat(edgeData.toNode));
                continue;
            }
            grid.edges.push(new AbstractEdge_1.default(edgeData, sender, receiver));
        }
        return grid;
    };
    AbstractGrid.prototype.saveToJSON = function () {
        return {
            nodes: this.nodes.map(function (node) { return node.saveToJSON(); }),
            edges: this.edges.map(function (edge) { return edge.saveToJSON(); })
        };
    };
    AbstractGrid.makeFromJSON = function (data) {
        var grid = new AbstractGrid();
        grid.nodes = data.nodes.map(function (nodeData) { return AbstractNode_1.default.makeFromJSON(nodeData); });
        grid.edges = data.edges.map(function (edgeData) { return AbstractEdge_1.default.makeFromJSON(edgeData); });
        return grid;
    };
    return AbstractGrid;
}());
exports.default = AbstractGrid;
