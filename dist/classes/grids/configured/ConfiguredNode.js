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
var ConfiguredNode = /** @class */ (function (_super) {
    __extends(ConfiguredNode, _super);
    function ConfiguredNode(nodeData) {
        var _this = _super.call(this, nodeData.ogData) || this;
        _this.content = nodeData.content;
        _this.placementPriority = Math.random();
        _this.verticalExtensionChance = Math.random();
        _this.horizontalExtensionChance = Math.random();
        return _this;
    }
    ConfiguredNode.prototype.saveToJSON = function () {
        return __assign(__assign({}, _super.prototype.saveToJSON.call(this)), { placementPriority: this.placementPriority, verticalExtensionChance: this.verticalExtensionChance, horizontalExtensionChance: this.horizontalExtensionChance });
    };
    ConfiguredNode.makeFromJSON = function (data) {
        var node = new ConfiguredNode(data);
        node.placementPriority = data.placementPriority;
        node.verticalExtensionChance = data.verticalExtensionChance;
        node.horizontalExtensionChance = data.horizontalExtensionChance;
        return node;
    };
    return ConfiguredNode;
}(AbstractNode_1.default));
exports.default = ConfiguredNode;
