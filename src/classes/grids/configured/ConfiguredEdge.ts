import { CardinalDirection } from "src/classes/CardinalDirection";
import AbstractEdge from "../abstract/AbstractEdge";

export default class ConfiguredEdge extends AbstractEdge {
	placementPriority: number
	cardinalPreferenceForSenderAttachment: CardinalDirection
	cardinalPreferenceForReceiverAttachment: CardinalDirection
}
