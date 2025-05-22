import AbstractNode, { type AbstractNodeJSON } from "../abstract/AbstractNode";
import NodeCell from "./cells/NodeCell";
import ConfiguredNode from "../configured/ConfiguredNode";
import { Coordinate } from "../../Coordinate";

export interface DrawnNodeJSON extends AbstractNodeJSON {
	coordinate: Coordinate;
	width: number;
	height: number;
	cells: { row: number; col: number }[];
	// Add any other relevant properties here if needed
}

export default class DrawnNode extends AbstractNode {
	private nodeToDraw: ConfiguredNode;
	private cells: NodeCell[];
	private coordinate: Coordinate;
	private width: number;
	private height: number;

	constructor(nodeToDraw: ConfiguredNode) {
		super(nodeToDraw.ogData);
		this.nodeToDraw = nodeToDraw;
		this.cells = [];
		this.coordinate = { row: 0, col: 0 };
		this.width = 1;
		this.height = 1;
	}

	public getCoordinate(): Coordinate {
		return this.coordinate;
	}

	public setCoordinate(coord: Coordinate): void {
		this.coordinate = coord;
	}

	public getWidth(): number {
		return this.width;
	}

	public getHeight(): number {
		return this.height;
	}

	public getCells(): NodeCell[] {
		return this.cells;
	}

	public addCell(cell: NodeCell): void {
		this.cells.push(cell);
	}

	public removeCell(cell: NodeCell): void {
		const index = this.cells.findIndex(c => c.row === cell.row && c.col === cell.col);
		if (index !== -1) {
			this.cells.splice(index, 1);
		}
	}

	public hasCellAt(coord: Coordinate): boolean {
		return this.cells.some(cell => cell.row === coord.row && cell.col === coord.col);
	}

	public getCellsInRow(rowIndex: number): NodeCell[] {
		return this.cells.filter(cell => cell.row === rowIndex);
	}

	public getCellsInColumn(colIndex: number): NodeCell[] {
		return this.cells.filter(cell => cell.col === colIndex);
	}

	public handleRowDuplicationAtIndex(rowIndex: number): void {
		// Find all cells in the row being cloned
		const cellsToClone = this.getCellsInRow(rowIndex);
		
		// For each cell in the row, create a clone and add it to our cells
		for (const cell of cellsToClone) {
			const clonedCell = new NodeCell(this);
			clonedCell.row = rowIndex + 1; // Place it in the new row
			clonedCell.col = cell.col;
			this.cells.push(clonedCell);
		}

		// Update height if we have cells in the cloned row
		if (cellsToClone.length > 0) {
			this.height++;
		}

		// Update coordinates of cells below the cloned row
		for (const cell of this.cells) {
			if (cell.row > rowIndex) {
				cell.row++;
			}
		}

		// Update our own coordinate if needed
		if (this.coordinate.row > rowIndex) {
			this.coordinate.row++;
		}
	}

	public handleColDuplicationAtIndex(colIndex: number): void {
		// Find all cells in the column being cloned
		const cellsToClone = this.getCellsInColumn(colIndex);
		
		// For each cell in the column, create a clone and add it to our cells
		for (const cell of cellsToClone) {
			const clonedCell = new NodeCell(this);
			clonedCell.col = colIndex + 1; // Place it in the new column
			clonedCell.row = cell.row;
			this.cells.push(clonedCell);
		}

		// Update width if we have cells in the cloned column
		if (cellsToClone.length > 0) {
			this.width++;
		}

		// Update coordinates of cells to the right of the cloned column
		for (const cell of this.cells) {
			if (cell.col > colIndex) {
				cell.col++;
			}
		}

		// Update our own coordinate if needed
		if (this.coordinate.col > colIndex) {
			this.coordinate.col++;
		}
	}

	public evaluate(): number {
		return this.nodeToDraw.placementPriority;
	}

	public saveToJSON(): DrawnNodeJSON {
		return {
			content: this.content,
			ogData: this.ogData,
			coordinate: this.coordinate,
			cells: this.cells.map(cell => ({ row: cell.row, col: cell.col })),
			width: this.width,
			height: this.height,
		};
	}

	public static makeFromJSON(data: DrawnNodeJSON): DrawnNode {
		const node = new DrawnNode(new ConfiguredNode(data));
		node.coordinate = data.coordinate;
		node.width = data.width ?? 1;
		node.height = data.height ?? 1;
		// Recreate NodeCell objects from data.cells
		if (data.cells && Array.isArray(data.cells)) {
			for (const cellData of data.cells) {
				const cell = new NodeCell(node);
				cell.row = cellData.row;
				cell.col = cellData.col;
				node.addCell(cell);
			}
		}
		return node;
	}
}
