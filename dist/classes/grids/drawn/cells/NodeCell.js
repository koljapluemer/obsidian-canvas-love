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
var NodeCell = /** @class */ (function (_super) {
    __extends(NodeCell, _super);
    function NodeCell(node) {
        var _this = _super.call(this) || this;
        _this.node = node;
        return _this;
    }
    NodeCell.prototype.getCellType = function () {
        return "nodeCell";
    };
    NodeCell.prototype.renderAsASCII = function () {
        return "O";
    };
    NodeCell.prototype.clone = function () {
        return new NodeCell(this.node);
    };
    NodeCell.prototype.isVerticallyTraversable = function () {
        return false;
    };
    NodeCell.prototype.isHorizontallyTraversable = function () {
        return false;
    };
    return NodeCell;
}(Cell_1.default));
exports.default = NodeCell;
