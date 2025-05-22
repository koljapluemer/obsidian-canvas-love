import AbstractGrid from "../abstract/AbstractGrid";
import ConfiguredGrid from "../configured/ConfiguredGrid";
import ConfiguredNode from "../configured/ConfiguredNode";
import { Coordinate } from "../../Coordinate";
import DrawnNode from "./DrawnNode";
import DrawnEdge from "./DrawnEdge";
import Cell from "./cells/Cell";
import EmptyCell from "./cells/EmptyCell";
import NodeCell from "./cells/NodeCell";

// should this class cache the actual Cells as well?
// or always generate them dynamically?
// one feels like SSoT violation, the other like wasted compute

export default class DrawnGrid extends AbstractGrid {
	private grid: Cell[][];
	public nodes: DrawnNode[];
	public edges: DrawnEdge[];

	constructor(configuredGrid: ConfiguredGrid) {
		super();
		this.grid = [[new EmptyCell()]];
		this.nodes = [];
		this.edges = [];
		this.placeNodes(configuredGrid);
	}

	public getRows(): number {
		return this.grid.length;
	}

	public getCols(): number {
		return this.grid[0].length;
	}

	public getCellAt(coord: Coordinate): Cell {
		if (coord.row < 0 || coord.row >= this.getRows() ||
			coord.col < 0 || coord.col >= this.getCols()) {
			return new EmptyCell();
		}
		return this.grid[coord.row][coord.col];
	}

	public isCellTraversable(coord: Coordinate): boolean {
		return this.getCellAt(coord).isTraversable();
	}

	public isCellEmpty(coord: Coordinate): boolean {
		return this.getCellAt(coord).isEmpty();
	}

	private cloneRow(rowIndex: number): void {
		const newRow = this.grid[rowIndex].map(cell => cell.clone());
		this.grid.splice(rowIndex, 0, newRow);
	}

	private cloneColumn(colIndex: number): void {
		for (let i = 0; i < this.grid.length; i++) {
			const cell = this.grid[i][colIndex].clone();
			this.grid[i].splice(colIndex, 0, cell);
		}
	}

	private placeNodes(configuredGrid: ConfiguredGrid): void {
		// Sort nodes by placement priority
		const sortedNodes = [...configuredGrid.nodes].sort((a, b) => {
			return a.placementPriority - b.placementPriority;
		});

		// Place each node
		for (const node of sortedNodes) {
			this.placeNode(node);
		}
	}

	private placeNode(node: ConfiguredNode): void {
		let coord: Coordinate | null = null;
		let attempts = 0;
		const MAX_ATTEMPTS = 10; // Prevent infinite loops

		console.log(`Attempting to place node: ${node.ogData.id}`);

		while (attempts < MAX_ATTEMPTS) {
			coord = this.getRandomLegalNodePlacementCell();
			if (coord) {
				console.log(`Legal placement found at (${coord.row}, ${coord.col})`);
				// Create and place the node
				const drawnNode = new DrawnNode(node);
				drawnNode.setCoordinate(coord);
				
				// Create the initial node cell
				const nodeCell = new NodeCell(drawnNode);
				nodeCell.row = coord.row;
				nodeCell.col = coord.col;
				drawnNode.addCell(nodeCell);
				
				this.nodes.push(drawnNode);
				this.grid[coord.row][coord.col] = nodeCell;
				
				console.log(`Node ${node.ogData.id} placed at (${coord.row}, ${coord.col})`);
				return;
			}

			// If no legal cell found, randomly choose to clone a row or column, or add an empty row/column
			const action = Math.floor(Math.random() * 4);
			let rowIndex: number | null = null;
			let colIndex: number | null = null;

			switch (action) {
				case 0:
					rowIndex = this.getRandomCloneableRowIndex();
					if (rowIndex !== null) {
						console.log(`Cloning row at index ${rowIndex}`);
						this.cloneRowAt(rowIndex);
					} else {
						console.log("No cloneable row found");
					}
					break;
				case 1:
					colIndex = this.getRandomCloneableColIndex();
					if (colIndex !== null) {
						console.log(`Cloning column at index ${colIndex}`);
						this.cloneColAt(colIndex);
					} else {
						console.log("No cloneable column found");
					}
					break;
				case 2:
					console.log("Adding empty row to start of grid");
					this.addEmptyRowToStartofGrid();
					break;
				case 3:
					console.log("Adding empty column to start of grid");
					this.addEmptyColumnToStartofGrid();
					break;
			}

			// Render the grid after cloning for debugging
			console.log("Grid after cloning:");
			console.log(this.renderAsASCII());
			console.log("\n");

			attempts++;
		}
		throw new Error("Failed to place node after multiple attempts");
	}

	public getDrawnNodes(): DrawnNode[] {
		return this.nodes as DrawnNode[];
	}

	public getDrawnEdges(): DrawnEdge[] {
		return this.edges as DrawnEdge[];
	}

	public renderAsASCII(): string {
		let result = "";
		for (let row = 0; row < this.getRows(); row++) {
			for (let col = 0; col < this.getCols(); col++) {
				result += this.grid[row][col].renderAsASCII();
			}
			result += "\n";
		}
		return result;
	}

	public getFlatCells(): Cell[] {
		return this.grid.flat();
	}

	public getRowAt(rowIndex: number): Cell[] {
		if (rowIndex < 0 || rowIndex >= this.getRows()) return [];
		return this.grid[rowIndex];
	}

	public getColAt(colIndex: number): Cell[] {
		if (colIndex < 0 || colIndex >= this.getCols()) return [];
		return this.grid.map(row => row[colIndex]);
	}

	public isCellEmptyAndAllNeighborsAreEmptyAt(coord: Coordinate): boolean {
		// Check the cell itself
		if (!this.isCellEmpty(coord)) return false;

		// Check all 8 neighbors
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				if (dx === 0 && dy === 0) continue; // Skip the cell itself
				const neighborCoord: Coordinate = { row: coord.row + dy, col: coord.col + dx };
				if (!this.isCellEmpty(neighborCoord)) return false;
			}
		}
		return true;
	}

	public getRandomLegalNodePlacementCell(): Coordinate | null {
		// Find all cells that are empty and have empty neighbors
		const legalCells: Coordinate[] = [];
		for (let row = 0; row < this.getRows(); row++) {
			for (let col = 0; col < this.getCols(); col++) {
				const coord: Coordinate = { row, col };
				if (this.isCellEmptyAndAllNeighborsAreEmptyAt(coord)) {
					legalCells.push(coord);
				}
			}
		}

		if (legalCells.length === 0) return null;
		return legalCells[Math.floor(Math.random() * legalCells.length)];
	}

	public isRowClonableAt(rowIndex: number): boolean {
		return rowIndex >= 0 && rowIndex < this.getRows();
	}

	public isColClonableAt(colIndex: number): boolean {
		return colIndex >= 0 && colIndex < this.getCols();
	}

	public getRandomCloneableRowIndex(): number | null {
		const cloneableRows = Array.from({ length: this.getRows() }, (_, i) => i)
			.filter(i => this.isRowClonableAt(i));
		if (cloneableRows.length === 0) return null;
		return cloneableRows[Math.floor(Math.random() * cloneableRows.length)];
	}

	public getRandomCloneableColIndex(): number | null {
		const cloneableCols = Array.from({ length: this.getCols() }, (_, i) => i)
			.filter(i => this.isColClonableAt(i));
		if (cloneableCols.length === 0) return null;
		return cloneableCols[Math.floor(Math.random() * cloneableCols.length)];
	}

	public cloneRowAt(rowIndex: number): void {
		if (!this.isRowClonableAt(rowIndex)) {
			throw new Error(`Cannot clone row at index ${rowIndex}`);
		}

		// Create new row with same cells
		const newRow = this.grid[rowIndex].map(cell => cell.clone());
		this.grid.splice(rowIndex, 0, newRow);

		// Update all nodes that might be affected
		for (const node of this.nodes) {
			node.handleRowDuplicationAtIndex(rowIndex);
		}
	}

	public cloneColAt(colIndex: number): void {
		if (!this.isColClonableAt(colIndex)) {
			throw new Error(`Cannot clone column at index ${colIndex}`);
		}

		// Add new column to each row
		for (let y = 0; y < this.getRows(); y++) {
			const newCell = this.grid[y][colIndex].clone();
			this.grid[y].splice(colIndex, 0, newCell);
		}

		// Update all nodes that might be affected
		for (const node of this.nodes) {
			node.handleColDuplicationAtIndex(colIndex);
		}
	}

	public addEmptyRowToStartofGrid(): void {
		const newRow = Array(this.getCols()).fill(new EmptyCell());
		this.grid.unshift(newRow);
		
		// Update row values for all nodes and their cells
		for (const node of this.nodes) {
			const coord = node.getCoordinate();
			node.setCoordinate({ ...coord, row: coord.row + 1 });
			
			// Update all cells belonging to this node
			for (const cell of node.getCells()) {
				cell.row++;
			}
		}
	}

	public addEmptyRowToEndofGrid(): void {
		const newRow = Array(this.getCols()).fill(new EmptyCell());
		this.grid.push(newRow);
		// No need to update node coordinates as they're relative to the start
	}

	public addEmptyColumnToStartofGrid(): void {
		for (let i = 0; i < this.getRows(); i++) {
			this.grid[i].unshift(new EmptyCell());
		}
		
		// Update col values for all nodes and their cells
		for (const node of this.nodes) {
			const coord = node.getCoordinate();
			node.setCoordinate({ ...coord, col: coord.col + 1 });
			
			// Update all cells belonging to this node
			for (const cell of node.getCells()) {
				cell.col++;
			}
		}
	}

	public addEmptyColumnToEndofGrid(): void {
		for (let i = 0; i < this.getRows(); i++) {
			this.grid[i].push(new EmptyCell());
		}
		// No need to update node coordinates as they're relative to the start
	}

	public override saveToJSON() {
		return {
			nodes: this.nodes.map(node => node.saveToJSON()),
			edges: this.edges.map(edge => edge.saveToJSON())
		};
	}

	public static override makeFromJSON(data: any) {
		const grid = new DrawnGrid(new ConfiguredGrid());
		// TODO: Recreate grid from data
		return grid;
	}

	public evaluate(): number {
		// TODO: Implement evaluation
		return 0
	}
}
