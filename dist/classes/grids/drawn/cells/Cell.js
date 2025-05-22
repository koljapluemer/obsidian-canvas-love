"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Cell = /** @class */ (function () {
    function Cell() {
    }
    Cell.prototype.isEmpty = function () {
        return this.getCellType() === "emptyCell";
    };
    Cell.prototype.clone = function () {
        return this;
    };
    Cell.prototype.columnsThatContainMeAreAllowedToBeCloned = function () {
        return true;
    };
    Cell.prototype.rowsThatContainMeAreAllowedToBeCloned = function () {
        return true;
    };
    return Cell;
}());
exports.default = Cell;
