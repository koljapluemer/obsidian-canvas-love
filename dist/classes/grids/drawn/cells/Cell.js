"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cell = /** @class */ (function () {
    function Cell() {
    }
    Cell.prototype.isTraversable = function () {
        return this.getCellType() === "emptyCell";
    };
    Cell.prototype.isEmpty = function () {
        return this.getCellType() === "emptyCell";
    };
    Cell.prototype.clone = function () {
        return this;
    };
    return Cell;
}());
exports.default = Cell;
