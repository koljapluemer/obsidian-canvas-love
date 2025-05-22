import { type GenericNode, type TextNode, type LinkNode } from '@trbn/jsoncanvas';

export interface AbstractNodeJSON {
	content: string;
	ogData: GenericNode;
}

export default class AbstractNode {
	content: string
	ogData: GenericNode

	constructor(nodeData: GenericNode) {
		if ('text' in nodeData) {
			this.content = (nodeData as TextNode).text;
		} else if ('url' in nodeData) {
			this.content = (nodeData as LinkNode).url;
		} else if ('file' in nodeData) {
			this.content = (nodeData as { file: string }).file;
		} else {
			this.content = "";
		}
		this.ogData = nodeData;
	}

	public saveToJSON(): AbstractNodeJSON {
		return {
			content: this.content,
			ogData: this.ogData
		};
	}

	public static makeFromJSON(data: AbstractNodeJSON): AbstractNode {
		const node = new AbstractNode(data.ogData);
		node.content = data.content;
		return node;
	}
}
