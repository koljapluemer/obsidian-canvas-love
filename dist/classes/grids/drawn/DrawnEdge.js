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
var AbstractEdge_1 = require("../abstract/AbstractEdge");
var ConfiguredEdge_1 = require("../configured/ConfiguredEdge");
var DrawnEdge = /** @class */ (function (_super) {
    __extends(DrawnEdge, _super);
    function DrawnEdge(edgeToDraw, sender, receiver) {
        var _this = _super.call(this, edgeToDraw.ogData, sender, receiver) || this;
        _this.edgeToDraw = edgeToDraw;
        _this.cells = [];
        return _this;
    }
    DrawnEdge.prototype.getCells = function () {
        return this.cells;
    };
    DrawnEdge.prototype.addCell = function (cell) {
        this.cells.push(cell);
    };
    DrawnEdge.prototype.handleRowDuplicationAtIndex = function (rowIndex) {
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            if (cell.row > rowIndex) {
                cell.row++;
            }
        }
    };
    DrawnEdge.prototype.handleColDuplicationAtIndex = function (colIndex) {
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            if (cell.col > colIndex) {
                cell.col++;
            }
        }
    };
    DrawnEdge.prototype.evaluate = function () {
        return this.edgeToDraw.placementPriority;
    };
    DrawnEdge.prototype.saveToJSON = function () {
        return __assign(__assign({}, _super.prototype.saveToJSON.call(this)), { cells: this.cells.map(function (cell) { return ({ row: cell.row, col: cell.col }); }) });
    };
    DrawnEdge.makeFromJSON = function (data) {
        var baseEdge = _super.makeFromJSON.call(this, data);
        var configuredEdge = new ConfiguredEdge_1.default(data);
        var edge = new DrawnEdge(configuredEdge, baseEdge.sender, baseEdge.receiver);
        // TODO: Recreate cells from data.cells
        return edge;
    };
    return DrawnEdge;
}(AbstractEdge_1.default));
exports.default = DrawnEdge;
