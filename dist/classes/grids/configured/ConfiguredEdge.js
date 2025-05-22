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
var ConfiguredNode_1 = require("./ConfiguredNode");
var ConfiguredEdge = /** @class */ (function (_super) {
    __extends(ConfiguredEdge, _super);
    function ConfiguredEdge(edgeData) {
        var _this = _super.call(this, edgeData.ogData, new ConfiguredNode_1.default(edgeData.sender), new ConfiguredNode_1.default(edgeData.receiver)) || this;
        _this.label = edgeData.label;
        _this.arrowAtSender = edgeData.arrowAtSender;
        _this.arrowAtReceiver = edgeData.arrowAtReceiver;
        _this.placementPriority = Math.random();
        _this.cardinalPreferenceForSenderAttachment = _this.getRandomCardinalDirection();
        _this.cardinalPreferenceForReceiverAttachment = _this.getRandomCardinalDirection();
        return _this;
    }
    ConfiguredEdge.prototype.getRandomCardinalDirection = function () {
        var directions = ['N', 'E', 'S', 'W'];
        return directions[Math.floor(Math.random() * directions.length)];
    };
    ConfiguredEdge.prototype.saveToJSON = function () {
        return __assign(__assign({}, _super.prototype.saveToJSON.call(this)), { placementPriority: this.placementPriority, cardinalPreferenceForSenderAttachment: this.cardinalPreferenceForSenderAttachment, cardinalPreferenceForReceiverAttachment: this.cardinalPreferenceForReceiverAttachment });
    };
    ConfiguredEdge.makeFromJSON = function (data) {
        var edge = new ConfiguredEdge(data);
        edge.placementPriority = data.placementPriority;
        edge.cardinalPreferenceForSenderAttachment = data.cardinalPreferenceForSenderAttachment;
        edge.cardinalPreferenceForReceiverAttachment = data.cardinalPreferenceForReceiverAttachment;
        return edge;
    };
    return ConfiguredEdge;
}(AbstractEdge_1.default));
exports.default = ConfiguredEdge;
