import { type CardinalDirection } from "../../CardinalDirection";
import AbstractEdge, { type AbstractEdgeJSON } from "../abstract/AbstractEdge";
import ConfiguredNode from "./ConfiguredNode";

export interface ConfiguredEdgeJSON extends AbstractEdgeJSON {
	placementPriority: number;
	cardinalPreferenceForSenderAttachment: CardinalDirection;
	cardinalPreferenceForReceiverAttachment: CardinalDirection;
}

export default class ConfiguredEdge extends AbstractEdge {
	placementPriority: number
	cardinalPreferenceForSenderAttachment: CardinalDirection
	cardinalPreferenceForReceiverAttachment: CardinalDirection

	constructor(edgeData: AbstractEdgeJSON) {
		super(edgeData.ogData, new ConfiguredNode(edgeData.sender), new ConfiguredNode(edgeData.receiver));
		this.label = edgeData.label;
		this.arrowAtSender = edgeData.arrowAtSender;
		this.arrowAtReceiver = edgeData.arrowAtReceiver;
		this.placementPriority = Math.random();
		this.cardinalPreferenceForSenderAttachment = this.getRandomCardinalDirection();
		this.cardinalPreferenceForReceiverAttachment = this.getRandomCardinalDirection();
	}

	private getRandomCardinalDirection(): CardinalDirection {
		const directions: CardinalDirection[] = ['N', 'E', 'S', 'W'];
		return directions[Math.floor(Math.random() * directions.length)];
	}

	public override saveToJSON(): ConfiguredEdgeJSON {
		return {
			...super.saveToJSON(),
			placementPriority: this.placementPriority,
			cardinalPreferenceForSenderAttachment: this.cardinalPreferenceForSenderAttachment,
			cardinalPreferenceForReceiverAttachment: this.cardinalPreferenceForReceiverAttachment
		};
	}

	public static makeFromJSON(data: ConfiguredEdgeJSON): ConfiguredEdge {
		const edge = new ConfiguredEdge(data);
		edge.placementPriority = data.placementPriority;
		edge.cardinalPreferenceForSenderAttachment = data.cardinalPreferenceForSenderAttachment;
		edge.cardinalPreferenceForReceiverAttachment = data.cardinalPreferenceForReceiverAttachment;
		return edge;
	}
}
