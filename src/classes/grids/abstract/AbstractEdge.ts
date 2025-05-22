import AbstractNode, { type AbstractNodeJSON } from "./AbstractNode"
import { type Edge } from '@trbn/jsoncanvas';

export interface AbstractEdgeJSON {
	ogData: Edge;
	sender: AbstractNodeJSON;
	receiver: AbstractNodeJSON;
	label: string;
	arrowAtSender: boolean;
	arrowAtReceiver: boolean;
}

export default class AbstractEdge {
	ogData: Edge
	sender: AbstractNode
	receiver: AbstractNode
	label: string
	arrowAtSender: boolean
	arrowAtReceiver: boolean

	constructor(edgeData: Edge, sender: AbstractNode, receiver: AbstractNode) {
		this.ogData = edgeData;
		this.sender = sender;
		this.receiver = receiver;
		this.label = edgeData.label || "";
		this.arrowAtSender = edgeData.fromEnd === "arrow";
		this.arrowAtReceiver = edgeData.toEnd === "arrow";
	}

	public saveToJSON(): AbstractEdgeJSON {
		return {
			ogData: this.ogData,
			sender: this.sender.saveToJSON(),
			receiver: this.receiver.saveToJSON(),
			label: this.label,
			arrowAtSender: this.arrowAtSender,
			arrowAtReceiver: this.arrowAtReceiver
		};
	}

	public static makeFromJSON(data: AbstractEdgeJSON): AbstractEdge {
		const sender = AbstractNode.makeFromJSON(data.sender);
		const receiver = AbstractNode.makeFromJSON(data.receiver);
		const edge = new AbstractEdge(data.ogData, sender, receiver);
		edge.label = data.label;
		edge.arrowAtSender = data.arrowAtSender;
		edge.arrowAtReceiver = data.arrowAtReceiver;
		return edge;
	}
}
