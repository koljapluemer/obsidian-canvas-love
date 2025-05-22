import AbstractNode, { type AbstractNodeJSON } from "../abstract/AbstractNode";

export interface ConfiguredNodeJSON extends AbstractNodeJSON {
	placementPriority: number;
	verticalExtensionChance: number;
	horizontalExtensionChance: number;
}

export default class ConfiguredNode extends AbstractNode {
	placementPriority: number
	verticalExtensionChance: number
	horizontalExtensionChance: number

	constructor(nodeData: AbstractNodeJSON) {
		super(nodeData.ogData);
		this.content = nodeData.content;
		this.placementPriority = Math.random();
		this.verticalExtensionChance = Math.random();
		this.horizontalExtensionChance = Math.random();
	}

	public override saveToJSON(): ConfiguredNodeJSON {
		return {
			...super.saveToJSON(),
			placementPriority: this.placementPriority,
			verticalExtensionChance: this.verticalExtensionChance,
			horizontalExtensionChance: this.horizontalExtensionChance
		};
	}

	public static makeFromJSON(data: ConfiguredNodeJSON): ConfiguredNode {
		const node = new ConfiguredNode(data);
		node.placementPriority = data.placementPriority;
		node.verticalExtensionChance = data.verticalExtensionChance;
		node.horizontalExtensionChance = data.horizontalExtensionChance;
		return node;
	}
}
