import AbstractNode from "../abstract/AbstractNode";

export default class ConfiguredNode extends AbstractNode {
	placementPriority: number
	verticalExtensionChance: number
	horizontalExtensionChance: number
}
