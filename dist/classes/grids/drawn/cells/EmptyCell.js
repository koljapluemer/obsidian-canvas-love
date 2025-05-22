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
Object.defineProperty(exports, "__esModule", { value: true });
var Cell_1 = require("./Cell");
var EmptyCell = /** @class */ (function (_super) {
    __extends(EmptyCell, _super);
    function EmptyCell() {
        return _super.call(this) || this;
    }
    EmptyCell.prototype.getCellType = function () {
        return "emptyCell";
    };
    EmptyCell.prototype.renderAsASCII = function () {
        return "·";
    };
    EmptyCell.prototype.clone = function () {
        return new EmptyCell();
    };
    EmptyCell.prototype.isVerticallyTraversable = function () {
        return true;
    };
    EmptyCell.prototype.isHorizontallyTraversable = function () {
        return true;
    };
    return EmptyCell;
}(Cell_1.default));
exports.default = EmptyCell;
