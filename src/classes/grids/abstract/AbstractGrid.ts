import AbstractEdge from "./AbstractEdge";
import AbstractNode from "./AbstractNode";

export default class AbstractGrid {
	nodes: AbstractNode[]
	edges: AbstractEdge[]

	public static generateFromCanvasData(canvasData: any): AbstractGrid {
		const grid = new AbstractGrid();
		grid.nodes = [];
		grid.edges = [];

		// Create nodes first
		const nodeMap = new Map<string, AbstractNode>();
		
		for (const nodeData of canvasData.nodes) {
			const node = new AbstractNode(nodeData);
			nodeMap.set(nodeData.id, node);
			grid.nodes.push(node);
		}

		// Then create edges
		for (const edgeData of canvasData.edges) {
			const sender = nodeMap.get(edgeData.fromNode);
			const receiver = nodeMap.get(edgeData.toNode);
			
			if (!sender || !receiver) {
				console.warn(`Skipping edge: Could not find nodes for edge from ${edgeData.fromNode} to ${edgeData.toNode}`);
				continue;
			}

			grid.edges.push(new AbstractEdge(edgeData, sender, receiver));
		}

		return grid;
	}

	public saveToJSON(): any {
		return {
			nodes: this.nodes.map(node => node.saveToJSON()),
			edges: this.edges.map(edge => edge.saveToJSON())
		};
	}

	public static makeFromJSON(data: any): AbstractGrid {
		const grid = new AbstractGrid();
		grid.nodes = data.nodes.map((nodeData: any) => AbstractNode.makeFromJSON(nodeData));
		grid.edges = data.edges.map((edgeData: any) => AbstractEdge.makeFromJSON(edgeData));
		return grid;
	}
}
