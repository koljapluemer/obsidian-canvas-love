"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfiguredEdge_1 = require("./ConfiguredEdge");
var ConfiguredNode_1 = require("./ConfiguredNode");
var ConfiguredGrid = /** @class */ (function () {
    function ConfiguredGrid() {
        this.edges = [];
        this.nodes = [];
    }
    ConfiguredGrid.generateRandomizedFromAbstractGrid = function (anAbstractGrid) {
        var grid = new ConfiguredGrid();
        // Create configured nodes first
        var nodeMap = new Map();
        for (var _i = 0, _a = anAbstractGrid.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var configuredNode = new ConfiguredNode_1.default(node.saveToJSON());
            nodeMap.set(node.ogData.id, configuredNode);
            grid.nodes.push(configuredNode);
        }
        // Then create configured edges
        for (var _b = 0, _c = anAbstractGrid.edges; _b < _c.length; _b++) {
            var edge = _c[_b];
            var sender = nodeMap.get(edge.ogData.fromNode);
            var receiver = nodeMap.get(edge.ogData.toNode);
            if (!sender || !receiver) {
                console.warn("Skipping edge: Could not find nodes for edge from ".concat(edge.ogData.fromNode, " to ").concat(edge.ogData.toNode));
                continue;
            }
            var configuredEdge = new ConfiguredEdge_1.default(edge.saveToJSON());
            grid.edges.push(configuredEdge);
        }
        return grid;
    };
    ConfiguredGrid.prototype.saveToJSON = function () {
        return {
            nodes: this.nodes.map(function (node) { return node.saveToJSON(); }),
            edges: this.edges.map(function (edge) { return edge.saveToJSON(); })
        };
    };
    ConfiguredGrid.makeFromJSON = function (data) {
        var grid = new ConfiguredGrid();
        grid.nodes = data.nodes.map(function (nodeData) { return ConfiguredNode_1.default.makeFromJSON(nodeData); });
        grid.edges = data.edges.map(function (edgeData) { return ConfiguredEdge_1.default.makeFromJSON(edgeData); });
        return grid;
    };
    return ConfiguredGrid;
}());
exports.default = ConfiguredGrid;
