import AbstractEdge, { type AbstractEdgeJSON } from "../abstract/AbstractEdge";
import ConfiguredEdge from "../configured/ConfiguredEdge";
import EdgeCell from "./cells/EdgeCell";
import DrawnNode from "./DrawnNode";

export interface DrawnEdgeJSON extends AbstractEdgeJSON {
	cells: { row: number; col: number }[];
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
		return {
			...super.saveToJSON(),
			cells: this.cells.map(cell => ({ row: cell.row, col: cell.col })),
			// Add any other relevant properties here if needed
		};
	}

	public static override makeFromJSON(data: DrawnEdgeJSON): DrawnEdge {
		const baseEdge = super.makeFromJSON(data);
		const configuredEdge = new ConfiguredEdge(data);
		const edge = new DrawnEdge(
			configuredEdge,
			baseEdge.sender as DrawnNode,
			baseEdge.receiver as DrawnNode
		);
		// Recreate EdgeCell objects from data.cells
		if (data.cells && Array.isArray(data.cells)) {
			for (const cellData of data.cells) {
				const cell = new EdgeCell();
				cell.row = cellData.row;
				cell.col = cellData.col;
				edge.addCell(cell);
			}
		}
		return edge;
	}
}
