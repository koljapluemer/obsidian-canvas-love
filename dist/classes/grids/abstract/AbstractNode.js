"use strict";
exports.__esModule = true;
var AbstractNode = /** @class */ (function () {
    function AbstractNode(nodeData) {
        this.content = nodeData.text || nodeData.file || "";
        this.ogData = nodeData;
    }
    AbstractNode.prototype.saveToJSON = function () {
        return {
            content: this.content,
            ogData: this.ogData
        };
    };
    AbstractNode.makeFromJSON = function (data) {
        var node = new AbstractNode(data.ogData);
        node.content = data.content;
        return node;
    };
    return AbstractNode;
}());
exports["default"] = AbstractNode;
