"use strict";
exports.__esModule = true;
var AbstractEdge_1 = require("./AbstractEdge");
var AbstractNode_1 = require("./AbstractNode");
var AbstractGrid = /** @class */ (function () {
    function AbstractGrid() {
    }
    AbstractGrid.generateFromCanvasData = function (canvasData) {
        var grid = new AbstractGrid();
        grid.nodes = [];
        grid.edges = [];
        // Create nodes first
        var nodeMap = new Map();
        for (var _i = 0, _a = canvasData.nodes; _i < _a.length; _i++) {
            var nodeData = _a[_i];
            var node = new AbstractNode_1["default"](nodeData);
            nodeMap.set(nodeData.id, node);
            grid.nodes.push(node);
        }
        // Then create edges
        for (var _b = 0, _c = canvasData.edges; _b < _c.length; _b++) {
            var edgeData = _c[_b];
            var sender = nodeMap.get(edgeData.fromNode);
            var receiver = nodeMap.get(edgeData.toNode);
            if (!sender || !receiver) {
                console.warn("Skipping edge: Could not find nodes for edge from ".concat(edgeData.fromNode, " to ").concat(edgeData.toNode));
                continue;
            }
            grid.edges.push(new AbstractEdge_1["default"](edgeData, sender, receiver));
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
        grid.nodes = data.nodes.map(function (nodeData) { return AbstractNode_1["default"].makeFromJSON(nodeData); });
        grid.edges = data.edges.map(function (edgeData) { return AbstractEdge_1["default"].makeFromJSON(edgeData); });
        return grid;
    };
    return AbstractGrid;
}());
exports["default"] = AbstractGrid;
