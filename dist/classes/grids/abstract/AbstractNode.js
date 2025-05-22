"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractNode = /** @class */ (function () {
    function AbstractNode(nodeData) {
        if ('text' in nodeData) {
            this.content = nodeData.text;
        }
        else if ('url' in nodeData) {
            this.content = nodeData.url;
        }
        else if ('file' in nodeData) {
            this.content = nodeData.file;
        }
        else {
            this.content = "";
        }
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
exports.default = AbstractNode;
