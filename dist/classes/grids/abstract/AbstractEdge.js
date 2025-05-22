"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractNode_1 = require("./AbstractNode");
var AbstractEdge = /** @class */ (function () {
    function AbstractEdge(edgeData, sender, receiver) {
        this.ogData = edgeData;
        this.sender = sender;
        this.receiver = receiver;
        this.label = edgeData.label || "";
        this.arrowAtSender = edgeData.fromEnd === "arrow";
        this.arrowAtReceiver = edgeData.toEnd === "arrow";
    }
    AbstractEdge.prototype.saveToJSON = function () {
        return {
            ogData: this.ogData,
            sender: this.sender.saveToJSON(),
            receiver: this.receiver.saveToJSON(),
            label: this.label,
            arrowAtSender: this.arrowAtSender,
            arrowAtReceiver: this.arrowAtReceiver
        };
    };
    AbstractEdge.makeFromJSON = function (data) {
        var sender = AbstractNode_1.default.makeFromJSON(data.sender);
        var receiver = AbstractNode_1.default.makeFromJSON(data.receiver);
        var edge = new AbstractEdge(data.ogData, sender, receiver);
        edge.label = data.label;
        edge.arrowAtSender = data.arrowAtSender;
        edge.arrowAtReceiver = data.arrowAtReceiver;
        return edge;
    };
    return AbstractEdge;
}());
exports.default = AbstractEdge;
