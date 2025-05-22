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
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractNode_1 = require("../abstract/AbstractNode");
var NodeCell_1 = require("./cells/NodeCell");
var ConfiguredNode_1 = require("../configured/ConfiguredNode");
var DrawnNode = /** @class */ (function (_super) {
    __extends(DrawnNode, _super);
    function DrawnNode(nodeToDraw) {
        var _this = _super.call(this, nodeToDraw.ogData) || this;
        _this.nodeToDraw = nodeToDraw;
        _this.cells = [];
        _this.coordinate = { row: 0, col: 0 };
        _this.width = 1;
        _this.height = 1;
        return _this;
    }
    DrawnNode.prototype.getCoordinate = function () {
        return this.coordinate;
    };
    DrawnNode.prototype.setCoordinate = function (coord) {
        this.coordinate = coord;
    };
    DrawnNode.prototype.getWidth = function () {
        return this.width;
    };
    DrawnNode.prototype.getHeight = function () {
        return this.height;
    };
    DrawnNode.prototype.getCells = function () {
        return this.cells;
    };
    DrawnNode.prototype.addCell = function (cell) {
        this.cells.push(cell);
    };
    DrawnNode.prototype.removeCell = function (cell) {
        var index = this.cells.findIndex(function (c) { return c.row === cell.row && c.col === cell.col; });
        if (index !== -1) {
            this.cells.splice(index, 1);
        }
    };
    DrawnNode.prototype.hasCellAt = function (coord) {
        return this.cells.some(function (cell) { return cell.row === coord.row && cell.col === coord.col; });
    };
    DrawnNode.prototype.getCellsInRow = function (rowIndex) {
        return this.cells.filter(function (cell) { return cell.row === rowIndex; });
    };
    DrawnNode.prototype.getCellsInColumn = function (colIndex) {
        return this.cells.filter(function (cell) { return cell.col === colIndex; });
    };
    DrawnNode.prototype.handleRowDuplicationAtIndex = function (rowIndex) {
        // Find all cells in the row being cloned
        var cellsToClone = this.getCellsInRow(rowIndex);
        // For each cell in the row, create a clone and add it to our cells
        for (var _i = 0, cellsToClone_1 = cellsToClone; _i < cellsToClone_1.length; _i++) {
            var cell = cellsToClone_1[_i];
            var clonedCell = new NodeCell_1.default(this);
            clonedCell.row = rowIndex + 1; // Place it in the new row
            clonedCell.col = cell.col;
            this.cells.push(clonedCell);
        }
        // Update height if we have cells in the cloned row
        if (cellsToClone.length > 0) {
            this.height++;
        }
        // Update coordinates of cells below the cloned row
        for (var _a = 0, _b = this.cells; _a < _b.length; _a++) {
            var cell = _b[_a];
            if (cell.row > rowIndex) {
                cell.row++;
            }
        }
        // Update our own coordinate if needed
        if (this.coordinate.row > rowIndex) {
            this.coordinate.row++;
        }
    };
    DrawnNode.prototype.handleColDuplicationAtIndex = function (colIndex) {
        // Find all cells in the column being cloned
        var cellsToClone = this.getCellsInColumn(colIndex);
        // For each cell in the column, create a clone and add it to our cells
        for (var _i = 0, cellsToClone_2 = cellsToClone; _i < cellsToClone_2.length; _i++) {
            var cell = cellsToClone_2[_i];
            var clonedCell = new NodeCell_1.default(this);
            clonedCell.col = colIndex + 1; // Place it in the new column
            clonedCell.row = cell.row;
            this.cells.push(clonedCell);
        }
        // Update width if we have cells in the cloned column
        if (cellsToClone.length > 0) {
            this.width++;
        }
        // Update coordinates of cells to the right of the cloned column
        for (var _a = 0, _b = this.cells; _a < _b.length; _a++) {
            var cell = _b[_a];
            if (cell.col > colIndex) {
                cell.col++;
            }
        }
        // Update our own coordinate if needed
        if (this.coordinate.col > colIndex) {
            this.coordinate.col++;
        }
    };
    DrawnNode.prototype.evaluate = function () {
        return this.nodeToDraw.placementPriority;
    };
    DrawnNode.prototype.saveToJSON = function () {
        return __assign(__assign({}, _super.prototype.saveToJSON.call(this)), { coordinate: this.coordinate, width: this.width, height: this.height, cells: this.cells.map(function (cell) { return ({ row: cell.row, col: cell.col }); }) });
    };
    DrawnNode.makeFromJSON = function (data) {
        var node = new DrawnNode(new ConfiguredNode_1.default(data));
        node.coordinate = data.coordinate;
        node.width = data.width;
        node.height = data.height;
        // Recreate NodeCell objects from data.cells
        if (data.cells && Array.isArray(data.cells)) {
            for (var _i = 0, _a = data.cells; _i < _a.length; _i++) {
                var cellData = _a[_i];
                var cell = new NodeCell_1.default(node);
                cell.row = cellData.row;
                cell.col = cellData.col;
                node.addCell(cell);
            }
        }
        return node;
    };
    return DrawnNode;
}(AbstractNode_1.default));
exports.default = DrawnNode;
