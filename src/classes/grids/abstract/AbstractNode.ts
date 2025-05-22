export default class AbstractNode {
	content: string
	ogData: any

	constructor(nodeData: any) {
		this.content = nodeData.text || nodeData.file || "";
		this.ogData = nodeData;
	}

	public saveToJSON(): any {
		return {
			content: this.content,
			ogData: this.ogData
		};
	}

	public static makeFromJSON(data: any): AbstractNode {
		const node = new AbstractNode(data.ogData);
		node.content = data.content;
		return node;
	}
}
