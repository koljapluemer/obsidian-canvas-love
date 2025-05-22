import AbstractEdge, { type AbstractEdgeJSON } from "../abstract/AbstractEdge";
import ConfiguredEdge from "../configured/ConfiguredEdge";
import EdgeCell from "./cells/EdgeCell";
import DrawnNode from "./DrawnNode";

export interface DrawnEdgeJSON extends AbstractEdgeJSON {
	cells?: { row: number; col: number }[];
	sender: {
		content: string;
		ogData: any;
		coordinate: { row: number; col: number };
	};
	receiver: {
		content: string;
		ogData: any;
		coordinate: { row: number; col: number };
	};
	// Add any other relevant properties here if needed
}

export default class DrawnEdge extends AbstractEdge {
	private edgeToDraw: ConfiguredEdge;
	private cells: EdgeCell[];

	constructor(edgeToDraw: ConfiguredEdge, sender: DrawnNode, receiver: DrawnNode) {
		super(edgeToDraw.ogData, sender, receiver);
		this.edgeToDraw = edgeToDraw;
		this.cells = [];
	}

	public getCells(): EdgeCell[] {
		return this.cells;
	}

	public addCell(cell: EdgeCell): void {
		this.cells.push(cell);
	}

	public handleRowDuplicationAtIndex(rowIndex: number): void {
		for (const cell of this.cells) {
			if (cell.row > rowIndex) {
				cell.row++;
			}
		}
	}

	public handleColDuplicationAtIndex(colIndex: number): void {
		for (const cell of this.cells) {
			if (cell.col > colIndex) {
				cell.col++;
			}
		}
	}

	public evaluate(): number {
		return this.edgeToDraw.placementPriority;
	}

	public saveToJSON(): DrawnEdgeJSON {
		const sender = this.sender as DrawnNode;
		const receiver = this.receiver as DrawnNode;
		return {
			ogData: this.ogData,
			sender: {
				content: sender.content,
				ogData: sender.ogData,
				coordinate: sender.getCoordinate()
			},
			receiver: {
				content: receiver.content,
				ogData: receiver.ogData,
				coordinate: receiver.getCoordinate()
			},
			label: this.label,
			arrowAtSender: this.arrowAtSender,
			arrowAtReceiver: this.arrowAtReceiver,
			cells: this.cells.map(cell => ({ row: cell.row, col: cell.col }))
		};
	}

	public static makeFromJSON(data: DrawnEdgeJSON): DrawnEdge {
		// Create minimal sender/receiver objects (not DrawnNode instances)
		const sender = {
			content: data.sender.content,
			ogData: data.sender.ogData,
			coordinate: data.sender.coordinate
		};
		const receiver = {
			content: data.receiver.content,
			ogData: data.receiver.ogData,
			coordinate: data.receiver.coordinate
		};
		// Use a dummy ConfiguredEdge (it will not be used for placement)
		const configuredEdge = new ConfiguredEdge(data);
		// @ts-ignore: sender/receiver are not full DrawnNode, but only minimal objects needed for serialization
		const edge = new DrawnEdge(configuredEdge, sender, receiver);
		// Restore cells from JSON
		if (data.cells && Array.isArray(data.cells)) {
			for (const cellData of data.cells) {
				const cell = new EdgeCell();
				cell.row = cellData.row;
				cell.col = cellData.col;
				cell.edge = edge;
				edge.addCell(cell);
			}
		}
		return edge;
	}
}
