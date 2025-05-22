import AbstractNode from "./AbstractNode"

export default class AbstractEdge {
	ogData: any
	sender: AbstractNode
	receiver: AbstractNode
	label: string
	arrowAtSender: boolean
	arrowAtReceiver: boolean

	constructor(edgeData: any, sender: AbstractNode, receiver: AbstractNode) {
		this.ogData = edgeData;
		this.sender = sender;
		this.receiver = receiver;
		this.label = edgeData.label || "";
		this.arrowAtSender = edgeData.fromSide === "arrow";
		this.arrowAtReceiver = edgeData.toSide === "arrow";
	}

	public saveToJSON(): any {
		return {
			ogData: this.ogData,
			sender: this.sender.saveToJSON(),
			receiver: this.receiver.saveToJSON(),
			label: this.label,
			arrowAtSender: this.arrowAtSender,
			arrowAtReceiver: this.arrowAtReceiver
		};
	}

	public static makeFromJSON(data: any): AbstractEdge {
		const sender = AbstractNode.makeFromJSON(data.sender);
		const receiver = AbstractNode.makeFromJSON(data.receiver);
		const edge = new AbstractEdge(data.ogData, sender, receiver);
		edge.label = data.label;
		edge.arrowAtSender = data.arrowAtSender;
		edge.arrowAtReceiver = data.arrowAtReceiver;
		return edge;
	}
}
