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
var EdgeCell = /** @class */ (function (_super) {
    __extends(EdgeCell, _super);
    function EdgeCell() {
        var _this = _super.call(this) || this;
        _this.connectsToNorth = false;
        _this.connectsToEast = false;
        _this.connectsToSouth = false;
        _this.connectsToWest = false;
        _this.hasArrowNorth = false;
        _this.hasArrowEast = false;
        _this.hasArrowSouth = false;
        _this.hasArrowWest = false;
        return _this;
    }
    EdgeCell.prototype.getCellType = function () {
        return "edgeCell";
    };
    EdgeCell.prototype.columnsThatContainMeAreAllowedToBeCloned = function () {
        return this.renderAsASCII() === "—";
    };
    EdgeCell.prototype.rowsThatContainMeAreAllowedToBeCloned = function () {
        return this.renderAsASCII() === "|";
    };
    EdgeCell.prototype.getHumanReadableDataString = function () {
        var dataString = "----_----";
        var chars = dataString.split('');
        if (this.connectsToNorth) {
            chars[0] = "N";
        }
        if (this.connectsToEast) {
            chars[1] = "E";
        }
        if (this.connectsToSouth) {
            chars[2] = "S";
        }
        if (this.connectsToWest) {
            chars[3] = "W";
        }
        if (this.hasArrowNorth) {
            chars[5] = "n";
        }
        if (this.hasArrowEast) {
            chars[6] = "e";
        }
        if (this.hasArrowSouth) {
            chars[7] = "s";
        }
        if (this.hasArrowWest) {
            chars[8] = "w";
        }
        return chars.join('');
    };
    EdgeCell.prototype.renderAsASCII = function () {
        var pattern = this.getHumanReadableDataString();
        switch (pattern) {
            case "-E-W_----": return "—";
            case "-E-W_-e--": return "→";
            case "-E-W_---w": return "←";
            case "N-S-_----": return "|";
            case "N-S-_n---": return "↑";
            case "N-S-_--s-": return "↓";
            case "NESW_----": return "🞡";
            default: return "~";
        }
    };
    return EdgeCell;
}(Cell_1.default));
exports.default = EdgeCell;
