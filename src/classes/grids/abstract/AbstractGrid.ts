import AbstractEdge, { type AbstractEdgeJSON } from "./AbstractEdge";
import AbstractNode, { type AbstractNodeJSON } from "./AbstractNode";
import { JSONCanvas } from '@trbn/jsoncanvas';

interface AbstractGridJSON {
	nodes: AbstractNodeJSON[];
	edges: AbstractEdgeJSON[];
}

export default class AbstractGrid {
	nodes: AbstractNode[]
	edges: AbstractEdge[]

	public static generateFromCanvasData(canvas: JSONCanvas): AbstractGrid {
		const grid = new AbstractGrid();
		grid.nodes = [];
		grid.edges = [];

		// Create nodes first
		const nodeMap = new Map<string, AbstractNode>();
		
		const canvasData = canvas.getNodes() as unknown as { nodes: any[], edges: any[] };
		console.log('Processing nodes:', canvasData.nodes);
		
		for (const nodeData of canvasData.nodes) {
			console.log('Processing node:', nodeData);
			const node = new AbstractNode(nodeData);
			nodeMap.set(nodeData.id, node);
			grid.nodes.push(node);
		}

		// Then create edges
		const edges = canvasData.edges;
		console.log('Processing edges:', edges);
		
		for (const edgeData of edges) {
			console.log('Processing edge:', edgeData);
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

	public saveToJSON(): AbstractGridJSON {
		return {
			nodes: this.nodes.map(node => node.saveToJSON()),
			edges: this.edges.map(edge => edge.saveToJSON())
		};
	}

	public static makeFromJSON(data: AbstractGridJSON): AbstractGrid {
		const grid = new AbstractGrid();
		grid.nodes = data.nodes.map(nodeData => AbstractNode.makeFromJSON(nodeData));
		grid.edges = data.edges.map(edgeData => AbstractEdge.makeFromJSON(edgeData));
		return grid;
	}
}
