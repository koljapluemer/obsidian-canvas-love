import AbstractGrid from "../abstract/AbstractGrid";
import ConfiguredEdge from "./ConfiguredEdge";
import ConfiguredNode from "./ConfiguredNode";

export default class ConfiguredGrid {
	edges: ConfiguredEdge[]
	nodes: ConfiguredNode[]

	public static generateRandomizedFromAbstractGrid(anAbstractGrid:AbstractGrid) {}

	public saveToJSON() {}
	public static makeFromJSON() {}
}
