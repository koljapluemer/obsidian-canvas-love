"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractGrid_1 = require("../abstract/AbstractGrid");
var ConfiguredGrid_1 = require("../configured/ConfiguredGrid");
var DrawnNode_1 = require("./DrawnNode");
var EmptyCell_1 = require("./cells/EmptyCell");
var NodeCell_1 = require("./cells/NodeCell");
// should this class cache the actual Cells as well?
// or always generate them dynamically?
// one feels like SSoT violation, the other like wasted compute
var DrawnGrid = /** @class */ (function (_super) {
    __extends(DrawnGrid, _super);
    function DrawnGrid(configuredGrid) {
        var _this = _super.call(this) || this;
        _this.grid = [[new EmptyCell_1.default()]];
        _this.nodes = [];
        _this.edges = [];
        _this.placeNodes(configuredGrid);
        return _this;
    }
    DrawnGrid.prototype.getRows = function () {
        return this.grid.length;
    };
    DrawnGrid.prototype.getCols = function () {
        return this.grid[0].length;
    };
    DrawnGrid.prototype.getCellAt = function (coord) {
        if (coord.row < 0 || coord.row >= this.getRows() ||
            coord.col < 0 || coord.col >= this.getCols()) {
            return new EmptyCell_1.default();
        }
        return this.grid[coord.row][coord.col];
    };
    DrawnGrid.prototype.isCellTraversable = function (coord) {
        return this.getCellAt(coord).isTraversable();
    };
    DrawnGrid.prototype.isCellEmpty = function (coord) {
        return this.getCellAt(coord).isEmpty();
    };
    DrawnGrid.prototype.cloneRow = function (rowIndex) {
        var newRow = this.grid[rowIndex].map(function (cell) { return cell.clone(); });
        this.grid.splice(rowIndex, 0, newRow);
    };
    DrawnGrid.prototype.cloneColumn = function (colIndex) {
        for (var i = 0; i < this.grid.length; i++) {
            var cell = this.grid[i][colIndex].clone();
            this.grid[i].splice(colIndex, 0, cell);
        }
    };
    DrawnGrid.prototype.placeNodes = function (configuredGrid) {
        // Sort nodes by placement priority
        var sortedNodes = __spreadArray([], configuredGrid.nodes, true).sort(function (a, b) {
            return a.placementPriority - b.placementPriority;
        });
        // Place each node
        for (var _i = 0, sortedNodes_1 = sortedNodes; _i < sortedNodes_1.length; _i++) {
            var node = sortedNodes_1[_i];
            this.placeNode(node);
        }
    };
    DrawnGrid.prototype.placeNode = function (node) {
        var coord = null;
        var attempts = 0;
        var MAX_ATTEMPTS = 10; // Prevent infinite loops
        console.log("Attempting to place node: ".concat(node.ogData.id));
        while (attempts < MAX_ATTEMPTS) {
            coord = this.getRandomLegalNodePlacementCell();
            if (coord) {
                console.log("Legal placement found at (".concat(coord.row, ", ").concat(coord.col, ")"));
                // Create and place the node
                var drawnNode = new DrawnNode_1.default(node);
                drawnNode.setCoordinate(coord);
                // Create the initial node cell
                var nodeCell = new NodeCell_1.default(drawnNode);
                nodeCell.row = coord.row;
                nodeCell.col = coord.col;
                drawnNode.addCell(nodeCell);
                this.nodes.push(drawnNode);
                this.grid[coord.row][coord.col] = nodeCell;
                console.log("Node ".concat(node.ogData.id, " placed at (").concat(coord.row, ", ").concat(coord.col, ")"));
                return;
            }
            // If no legal cell found, randomly choose to clone a row or column, or add an empty row/column
            var action = Math.floor(Math.random() * 4);
            var rowIndex = null;
            var colIndex = null;
            switch (action) {
                case 0:
                    rowIndex = this.getRandomCloneableRowIndex();
                    if (rowIndex !== null) {
                        console.log("Cloning row at index ".concat(rowIndex));
                        this.cloneRowAt(rowIndex);
                    }
                    else {
                        console.log("No cloneable row found");
                    }
                    break;
                case 1:
                    colIndex = this.getRandomCloneableColIndex();
                    if (colIndex !== null) {
                        console.log("Cloning column at index ".concat(colIndex));
                        this.cloneColAt(colIndex);
                    }
                    else {
                        console.log("No cloneable column found");
                    }
                    break;
                case 2:
                    console.log("Adding empty row to start of grid");
                    this.addEmptyRowToStartofGrid();
                    break;
                case 3:
                    console.log("Adding empty column to start of grid");
                    this.addEmptyColumnToStartofGrid();
                    break;
            }
            // Render the grid after cloning for debugging
            console.log("Grid after cloning:");
            console.log(this.renderAsASCII());
            console.log("\n");
            attempts++;
        }
        throw new Error("Failed to place node after multiple attempts");
    };
    DrawnGrid.prototype.getDrawnNodes = function () {
        return this.nodes;
    };
    DrawnGrid.prototype.getDrawnEdges = function () {
        return this.edges;
    };
    DrawnGrid.prototype.renderAsASCII = function () {
        var result = "";
        for (var row = 0; row < this.getRows(); row++) {
            for (var col = 0; col < this.getCols(); col++) {
                result += this.grid[row][col].renderAsASCII();
            }
            result += "\n";
        }
        return result;
    };
    DrawnGrid.prototype.getFlatCells = function () {
        return this.grid.flat();
    };
    DrawnGrid.prototype.getRowAt = function (rowIndex) {
        if (rowIndex < 0 || rowIndex >= this.getRows())
            return [];
        return this.grid[rowIndex];
    };
    DrawnGrid.prototype.getColAt = function (colIndex) {
        if (colIndex < 0 || colIndex >= this.getCols())
            return [];
        return this.grid.map(function (row) { return row[colIndex]; });
    };
    DrawnGrid.prototype.isCellEmptyAndAllNeighborsAreEmptyAt = function (coord) {
        // Check the cell itself
        if (!this.isCellEmpty(coord))
            return false;
        // Check all 8 neighbors
        for (var dy = -1; dy <= 1; dy++) {
            for (var dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0)
                    continue; // Skip the cell itself
                var neighborCoord = { row: coord.row + dy, col: coord.col + dx };
                if (!this.isCellEmpty(neighborCoord))
                    return false;
            }
        }
        return true;
    };
    DrawnGrid.prototype.getRandomLegalNodePlacementCell = function () {
        // Find all cells that are empty and have empty neighbors
        var legalCells = [];
        for (var row = 0; row < this.getRows(); row++) {
            for (var col = 0; col < this.getCols(); col++) {
                var coord = { row: row, col: col };
                if (this.isCellEmptyAndAllNeighborsAreEmptyAt(coord)) {
                    legalCells.push(coord);
                }
            }
        }
        if (legalCells.length === 0)
            return null;
        return legalCells[Math.floor(Math.random() * legalCells.length)];
    };
    DrawnGrid.prototype.isRowClonableAt = function (rowIndex) {
        return rowIndex >= 0 && rowIndex < this.getRows();
    };
    DrawnGrid.prototype.isColClonableAt = function (colIndex) {
        return colIndex >= 0 && colIndex < this.getCols();
    };
    DrawnGrid.prototype.getRandomCloneableRowIndex = function () {
        var _this = this;
        var cloneableRows = Array.from({ length: this.getRows() }, function (_, i) { return i; })
            .filter(function (i) { return _this.isRowClonableAt(i); });
        if (cloneableRows.length === 0)
            return null;
        return cloneableRows[Math.floor(Math.random() * cloneableRows.length)];
    };
    DrawnGrid.prototype.getRandomCloneableColIndex = function () {
        var _this = this;
        var cloneableCols = Array.from({ length: this.getCols() }, function (_, i) { return i; })
            .filter(function (i) { return _this.isColClonableAt(i); });
        if (cloneableCols.length === 0)
            return null;
        return cloneableCols[Math.floor(Math.random() * cloneableCols.length)];
    };
    DrawnGrid.prototype.cloneRowAt = function (rowIndex) {
        if (!this.isRowClonableAt(rowIndex)) {
            throw new Error("Cannot clone row at index ".concat(rowIndex));
        }
        // Create new row with same cells
        var newRow = this.grid[rowIndex].map(function (cell) { return cell.clone(); });
        this.grid.splice(rowIndex, 0, newRow);
        // Update all nodes that might be affected
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.handleRowDuplicationAtIndex(rowIndex);
        }
    };
    DrawnGrid.prototype.cloneColAt = function (colIndex) {
        if (!this.isColClonableAt(colIndex)) {
            throw new Error("Cannot clone column at index ".concat(colIndex));
        }
        // Add new column to each row
        for (var y = 0; y < this.getRows(); y++) {
            var newCell = this.grid[y][colIndex].clone();
            this.grid[y].splice(colIndex, 0, newCell);
        }
        // Update all nodes that might be affected
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            node.handleColDuplicationAtIndex(colIndex);
        }
    };
    DrawnGrid.prototype.addEmptyRowToStartofGrid = function () {
        var newRow = Array(this.getCols()).fill(new EmptyCell_1.default());
        this.grid.unshift(newRow);
        // Update row values for all nodes and their cells
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var coord = node.getCoordinate();
            node.setCoordinate(__assign(__assign({}, coord), { row: coord.row + 1 }));
            // Update all cells belonging to this node
            for (var _b = 0, _c = node.getCells(); _b < _c.length; _b++) {
                var cell = _c[_b];
                cell.row++;
            }
        }
    };
    DrawnGrid.prototype.addEmptyRowToEndofGrid = function () {
        var newRow = Array(this.getCols()).fill(new EmptyCell_1.default());
        this.grid.push(newRow);
        // No need to update node coordinates as they're relative to the start
    };
    DrawnGrid.prototype.addEmptyColumnToStartofGrid = function () {
        for (var i = 0; i < this.getRows(); i++) {
            this.grid[i].unshift(new EmptyCell_1.default());
        }
        // Update col values for all nodes and their cells
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            var coord = node.getCoordinate();
            node.setCoordinate(__assign(__assign({}, coord), { col: coord.col + 1 }));
            // Update all cells belonging to this node
            for (var _b = 0, _c = node.getCells(); _b < _c.length; _b++) {
                var cell = _c[_b];
                cell.col++;
            }
        }
    };
    DrawnGrid.prototype.addEmptyColumnToEndofGrid = function () {
        for (var i = 0; i < this.getRows(); i++) {
            this.grid[i].push(new EmptyCell_1.default());
        }
        // No need to update node coordinates as they're relative to the start
    };
    DrawnGrid.prototype.saveToJSON = function () {
        return {
            nodes: this.nodes.map(function (node) { return node.saveToJSON(); }),
            edges: this.edges.map(function (edge) { return edge.saveToJSON(); })
        };
    };
    DrawnGrid.makeFromJSON = function (data) {
        var grid = new DrawnGrid(new ConfiguredGrid_1.default());
        // TODO: Recreate grid from data
        return grid;
    };
    DrawnGrid.prototype.evaluate = function () {
        // TODO: Implement evaluation
        return 0;
    };
    return DrawnGrid;
}(AbstractGrid_1.default));
exports.default = DrawnGrid;
