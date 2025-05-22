import AbstractGrid from "../abstract/AbstractGrid";
import ConfiguredEdge, { type ConfiguredEdgeJSON } from "./ConfiguredEdge";
import ConfiguredNode, { type ConfiguredNodeJSON } from "./ConfiguredNode";

export interface ConfiguredGridJSON {
	nodes: ConfiguredNodeJSON[];
	edges: ConfiguredEdgeJSON[];
}

export default class ConfiguredGrid {
	edges: ConfiguredEdge[]
	nodes: ConfiguredNode[]

	constructor() {
		this.edges = [];
		this.nodes = [];
	}

	public static generateRandomizedFromAbstractGrid(anAbstractGrid: AbstractGrid): ConfiguredGrid {
		const grid = new ConfiguredGrid();
		
		// Create configured nodes first
		const nodeMap = new Map<string, ConfiguredNode>();
		for (const node of anAbstractGrid.nodes) {
			const configuredNode = new ConfiguredNode(node.saveToJSON());
			nodeMap.set(node.ogData.id, configuredNode);
			grid.nodes.push(configuredNode);
		}

		// Then create configured edges
		for (const edge of anAbstractGrid.edges) {
			const sender = nodeMap.get(edge.ogData.fromNode);
			const receiver = nodeMap.get(edge.ogData.toNode);
			
			if (!sender || !receiver) {
				console.warn(`Skipping edge: Could not find nodes for edge from ${edge.ogData.fromNode} to ${edge.ogData.toNode}`);
				continue;
			}

			const configuredEdge = new ConfiguredEdge(edge.saveToJSON());
			grid.edges.push(configuredEdge);
		}

		return grid;
	}

	public saveToJSON(): ConfiguredGridJSON {
		return {
			nodes: this.nodes.map(node => node.saveToJSON()),
			edges: this.edges.map(edge => edge.saveToJSON())
		};
	}

	public static makeFromJSON(data: ConfiguredGridJSON): ConfiguredGrid {
		const grid = new ConfiguredGrid();
		grid.nodes = data.nodes.map(nodeData => ConfiguredNode.makeFromJSON(nodeData));
		grid.edges = data.edges.map(edgeData => ConfiguredEdge.makeFromJSON(edgeData));
		return grid;
	}
}
