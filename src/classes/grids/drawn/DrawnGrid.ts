import ConfiguredGrid from "../configured/ConfiguredGrid";
import ConfiguredNode from "../configured/ConfiguredNode";
import ConfiguredEdge from "../configured/ConfiguredEdge";
import { Coordinate } from "../../Coordinate";
import DrawnNode, { DrawnNodeJSON } from "./DrawnNode";
import DrawnEdge, { DrawnEdgeJSON } from "./DrawnEdge";
import Cell from "./cells/Cell";
import EmptyCell from "./cells/EmptyCell";
import NodeCell from "./cells/NodeCell";
import EdgeCell from "./cells/EdgeCell";
import { CardinalDirection } from "../../CardinalDirection";

export interface Serializable<T> {
	saveToJSON(): T;
}

export type DrawnCellJSON =
	| { type: "emptyCell"; row: number; col: number }
	| { type: "nodeCell"; row: number; col: number; nodeIndex: number }
	| {
		type: "edgeCell";
		row: number;
		col: number;
		edgeIndex: number;
		connectsToNorth: boolean;
		connectsToEast: boolean;
		connectsToSouth: boolean;
		connectsToWest: boolean;
		hasArrowNorth: boolean;
		hasArrowEast: boolean;
		hasArrowSouth: boolean;
		hasArrowWest: boolean;
	};

export interface DrawnGridJSON {
	nodes: DrawnNodeJSON[];
	edges: DrawnEdgeJSON[];
	cells?: DrawnCellJSON[];
}

export default class DrawnGrid implements Serializable<DrawnGridJSON> {
	private grid: (EmptyCell | NodeCell | EdgeCell)[][];
	public nodes: DrawnNode[];
	public edges: DrawnEdge[];

	constructor(configuredGrid: ConfiguredGrid) {
		this.grid = [[new EmptyCell()]];
		this.nodes = [];
		this.edges = [];
		this.placeNodes(configuredGrid);
		this.placeEdges(configuredGrid);
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
		const MAX_ATTEMPTS = 100; // Prevent infinite loops

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

	private isCoordinateInGrid(rowIndex: number, colIndex: number): boolean {
		return rowIndex >= 0 && rowIndex < this.getRows() && colIndex >= 0 && colIndex < this.getCols();
	}

	public isRowClonableAt(rowIndex: number): boolean {
		// First check if row is in grid
		if (!this.isCoordinateInGrid(rowIndex, 0)) {
			return false;
		}

		// Then check if all cells in the row allow cloning
		for (let col = 0; col < this.getCols(); col++) {
			if (!this.grid[rowIndex][col].rowsThatContainMeAreAllowedToBeCloned()) {
				return false;
			}
		}

		return true;
	}

	public isColClonableAt(colIndex: number): boolean {
		// First check if column is in grid
		if (!this.isCoordinateInGrid(0, colIndex)) {
			return false;
		}

		// Then check if all cells in the column allow cloning
		for (let row = 0; row < this.getRows(); row++) {
			if (!this.grid[row][colIndex].columnsThatContainMeAreAllowedToBeCloned()) {
				return false;
			}
		}

		return true;
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

	public saveToJSON(): DrawnGridJSON {
		return {
			nodes: this.nodes.map(node => node.saveToJSON()),
			edges: this.edges.map(edge => edge.saveToJSON())
		};
	}

	public static makeFromJSON(data: DrawnGridJSON): DrawnGrid {
		const grid = new DrawnGrid(new ConfiguredGrid());
		grid.nodes = data.nodes.map((nodeData) => DrawnNode.makeFromJSON(nodeData));
		grid.edges = data.edges.map((edgeData) => DrawnEdge.makeFromJSON(edgeData));

		// Find the maximum dimensions needed for the grid
		const maxRow = Math.max(
			...data.nodes.flatMap(node => node.cells.map(cell => cell.row)),
			...data.edges.flatMap(edge => edge.cells?.map(cell => cell.row) || [])
		);
		const maxCol = Math.max(
			...data.nodes.flatMap(node => node.cells.map(cell => cell.col)),
			...data.edges.flatMap(edge => edge.cells?.map(cell => cell.col) || [])
		);

		// Initialize the grid with empty cells
		grid.grid = Array.from({ length: maxRow + 1 }, () => 
			Array.from({ length: maxCol + 1 }, () => new EmptyCell())
		);

		// Place node cells
		for (const node of grid.nodes) {
			for (const cell of node.getCells()) {
				const nodeCell = new NodeCell(node);
				nodeCell.row = cell.row;
				nodeCell.col = cell.col;
				grid.grid[cell.row][cell.col] = nodeCell;
			}
		}

		// Place edge cells
		for (const edge of grid.edges) {
			for (const cell of edge.getCells()) {
				const edgeCell = new EdgeCell();
				edgeCell.edge = edge;
				edgeCell.row = cell.row;
				edgeCell.col = cell.col;
				edge.addCell(edgeCell);
				grid.grid[cell.row][cell.col] = edgeCell;
			}
		}

		grid.checkGridIntegrity();
		return grid;
	}

	private checkGridIntegrity(): void {
		// Check that all node and edge cells exist in the grid and match type
		for (const node of this.nodes) {
			for (const cell of node.getCells()) {
				const gridCell = this.grid[cell.row][cell.col];
				if (!gridCell || gridCell.getCellType() !== cell.getCellType()) {
					throw new Error(`Node cell at (${cell.row},${cell.col}) missing or type mismatch in grid`);
				}
			}
		}
		for (const edge of this.edges) {
			for (const cell of edge.getCells()) {
				const gridCell = this.grid[cell.row][cell.col];
				if (!gridCell || gridCell.getCellType() !== cell.getCellType()) {
					throw new Error(`Edge cell at (${cell.row},${cell.col}) missing or type mismatch in grid`);
				}
			}
		}
		// Optionally: check for extra cells in grid not referenced by any node/edge
	}

	public evaluate(): number {
		// TODO: Implement evaluation
		return 0
	}

	private findValidAttachmentPoint(node: DrawnNode, preferredDirection: CardinalDirection): Coordinate | null {
		// Get all cells that belong to this node
		const nodeCells = node.getCells();
		
		// Try each direction in order: preferred, then clockwise
		const directions: CardinalDirection[] = ['N', 'E', 'S', 'W'];
		const startIndex = directions.indexOf(preferredDirection);
		
		// Rotate array to start with preferred direction
		const orderedDirections = [
			...directions.slice(startIndex),
			...directions.slice(0, startIndex)
		];

		for (const direction of orderedDirections) {
			// For each cell of the node, check if there's a valid attachment point in this direction
			for (const cell of nodeCells) {
				// First check: attachment point must be within bounds and empty
				const attachmentPoint = this.getAdjacentCoordinate(cell, direction);
				if (!attachmentPoint) continue; // Skip if attachment point would be out of bounds
				
				// Verify attachment point is within grid bounds
				if (attachmentPoint.row < 0 || attachmentPoint.row >= this.getRows() ||
					attachmentPoint.col < 0 || attachmentPoint.col >= this.getCols()) {
					continue; // Skip if attachment point is out of bounds
				}
				
				if (!this.isCellEmpty(attachmentPoint)) continue; // Skip if attachment point is not empty
				
				// Second check: breathing space can be empty OR out of bounds
				const tempCell = new EmptyCell();
				tempCell.row = attachmentPoint.row;
				tempCell.col = attachmentPoint.col;
				const breathingSpace = this.getAdjacentCoordinate(tempCell, direction);
				
				// If breathing space exists, it must be empty
				if (breathingSpace && !this.isCellEmpty(breathingSpace)) continue;
				
				// If we get here, we have a valid attachment point:
				// - The attachment point exists, is within bounds, and is empty
				// - The breathing space is either empty or out of bounds
				return attachmentPoint;
			}
		}
		
		return null;
	}

	private getAdjacentCoordinate(cell: Cell, direction: CardinalDirection): Coordinate | null {
		const coord = { row: cell.row, col: cell.col };
		
		switch (direction) {
			case 'N':
				if (coord.row > 0) return { row: coord.row - 1, col: coord.col };
				break;
			case 'E':
				if (coord.col < this.getCols() - 1) return { row: coord.row, col: coord.col + 1 };
				break;
			case 'S':
				if (coord.row < this.getRows() - 1) return { row: coord.row + 1, col: coord.col };
				break;
			case 'W':
				if (coord.col > 0) return { row: coord.row, col: coord.col - 1 };
				break;
		}
		
		return null;
	}

	private extendRandomly(): void {
		const action = Math.floor(Math.random() * 4);
		let rowIndex: number | null = null;
		let colIndex: number | null = null;

		console.log(`Current grid dimensions: ${this.getRows()} rows x ${this.getCols()} cols`);

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

		// Validate grid structure after extension
		console.log(`New grid dimensions: ${this.getRows()} rows x ${this.getCols()} cols`);
		if (this.grid.length === 0 || this.grid[0].length === 0) {
			console.error("Grid structure is invalid after extension!");
			// Ensure grid has at least one cell
			this.grid = [[new EmptyCell()]];
		}

		// Render the grid after cloning for debugging
		console.log("Grid after extending:");
		console.log(this.renderAsASCII());
		console.log("\n");
	}

	private placeEdges(configuredGrid: ConfiguredGrid): void {
		// Sort edges by placement priority (same as nodes)
		const sortedEdges = [...configuredGrid.edges].sort((a, b) => {
			return a.placementPriority - b.placementPriority;
		});

		for (const edge of sortedEdges) {
			this.placeEdge(edge);
		}
	}

	private findManhattanPath(start: Coordinate, end: Coordinate): Coordinate[] | null {
		// Helper to check if a coordinate is an attachment point
		const isAttachmentPoint = (coord: Coordinate) =>
			(coord.row === start.row && coord.col === start.col) ||
			(coord.row === end.row && coord.col === end.col);

		// Helper to check if a move is allowed
		const canMove = (from: Coordinate, to: Coordinate, dir: { row: number, col: number }) => {
			const fromCell = this.grid[from.row][from.col];
			const toCell = this.grid[to.row][to.col];
			if (dir.row !== 0) { // Vertical move
				if (!isAttachmentPoint(from) && !fromCell.isVerticallyTraversable()) return false;
				if (!isAttachmentPoint(to) && !toCell.isVerticallyTraversable()) return false;
			} else { // Horizontal move
				if (!isAttachmentPoint(from) && !fromCell.isHorizontallyTraversable()) return false;
				if (!isAttachmentPoint(to) && !toCell.isHorizontallyTraversable()) return false;
			}
			return true;
		};

		// Simple BFS implementation
		const queue: { coord: Coordinate, path: Coordinate[] }[] = [{ coord: start, path: [start] }];
		const visited = new Set<string>();
		visited.add(`${start.row},${start.col}`);

		while (queue.length > 0) {
			const { coord, path } = queue.shift()!;
			
			if (coord.row === end.row && coord.col === end.col) {
				return path;
			}

			// Try all four directions
			const directions: { row: number, col: number }[] = [
				{ row: -1, col: 0 },  // North
				{ row: 1, col: 0 },   // South
				{ row: 0, col: -1 },  // West
				{ row: 0, col: 1 }    // East
			];

			for (const dir of directions) {
				const nextCoord = { row: coord.row + dir.row, col: coord.col + dir.col };
				const key = `${nextCoord.row},${nextCoord.col}`;

				if (visited.has(key)) continue;
				if (!this.isCoordinateInGrid(nextCoord.row, nextCoord.col)) continue;

				if (!canMove(coord, nextCoord, dir)) continue;

				visited.add(key);
				queue.push({ coord: nextCoord, path: [...path, nextCoord] });
			}
		}

		return null;
	}

	private addPathCell(edge: DrawnEdge, coord: Coordinate, prevCoord: Coordinate | null, nextCoord: Coordinate | null): EdgeCell {
		const cell = new EdgeCell();
		cell.row = coord.row;
		cell.col = coord.col;
		cell.edge = edge;

		// Connect to previous cell
		if (prevCoord) {
			const direction = this.getDirectionFromTo(prevCoord, coord);
			if (direction) {
				switch (direction) {
					case 'N': cell.connectsToNorth = true; break;
					case 'E': cell.connectsToEast = true; break;
					case 'S': cell.connectsToSouth = true; break;
					case 'W': cell.connectsToWest = true; break;
				}
			}
		}

		// Connect to next cell
		if (nextCoord) {
			const direction = this.getDirectionFromTo(coord, nextCoord);
			if (direction) {
				switch (direction) {
					case 'N': cell.connectsToNorth = true; break;
					case 'E': cell.connectsToEast = true; break;
					case 'S': cell.connectsToSouth = true; break;
					case 'W': cell.connectsToWest = true; break;
				}
			}
		}

		// Add to edge and grid
		edge.addCell(cell);
		this.grid[coord.row][coord.col] = cell;

		return cell;
	}

	private clearPathCells(edge: DrawnEdge, keepAttachmentPoints = true): void {
		// Get all cells except attachment points if needed
		const cellsToClear = keepAttachmentPoints 
			? edge.getCells().slice(2) // Skip first two cells (attachment points)
			: edge.getCells();

		// Clear each cell from the grid and edge
		for (const cell of cellsToClear) {
			this.grid[cell.row][cell.col] = new EmptyCell();
		}

		// Reset edge's cells array to just attachment points if needed
		if (keepAttachmentPoints) {
			edge.getCells().splice(2); // Remove all cells after the first two
		} else {
			edge.getCells().splice(0); // Remove all cells
		}
	}

	private placeEdge(edge: ConfiguredEdge): void {
		console.log(`Attempting to place edge from ${edge.ogData.fromNode} to ${edge.ogData.toNode}`);
		
		// Find the sender and receiver nodes
		const senderNode = this.nodes.find(n => n.ogData.id === edge.ogData.fromNode);
		if (!senderNode) {
			console.error(`Could not find sender node ${edge.ogData.fromNode}`);
			return;
		}

		const receiverNode = this.nodes.find(n => n.ogData.id === edge.ogData.toNode);
		if (!receiverNode) {
			console.error(`Could not find receiver node ${edge.ogData.toNode}`);
			return;
		}

		let attempts = 0;
		const MAX_ATTEMPTS = 200; // Increased for more thorough attempts
		
		// Create an empty edge that we'll populate immediately but clear on retry
		const currentEdge = new DrawnEdge(edge, senderNode, receiverNode);
		let senderAttachmentPoint: Coordinate | null = null;
		let receiverAttachmentPoint: Coordinate | null = null;
		let senderEdgeCell: EdgeCell | null = null;
		let receiverEdgeCell: EdgeCell | null = null;

		while (attempts < MAX_ATTEMPTS) {
			// Step 1: Try to find sender attachment point
			if (!senderAttachmentPoint) {
				senderAttachmentPoint = this.findValidAttachmentPoint(
					senderNode,
					edge.cardinalPreferenceForSenderAttachment
				);

				if (!senderAttachmentPoint) {
					console.log("No valid sender attachment point found, extending grid...");
					this.extendRandomly();
					attempts++;
					continue;
				}

				console.log(`Found valid sender attachment point at (${senderAttachmentPoint.row}, ${senderAttachmentPoint.col})`);
				
				// Create the sender edge cell
				senderEdgeCell = new EdgeCell();
				senderEdgeCell.row = senderAttachmentPoint.row;
				senderEdgeCell.col = senderAttachmentPoint.col;
				
				// Set connection and arrow properties for sender
				const senderDirection = this.getDirectionFromTo(senderAttachmentPoint, senderNode.getCoordinate());
				if (senderDirection) {
					// Set connection towards sender
					switch (senderDirection) {
						case 'N': senderEdgeCell.connectsToSouth = true; break;
						case 'E': senderEdgeCell.connectsToWest = true; break;
						case 'S': senderEdgeCell.connectsToNorth = true; break;
						case 'W': senderEdgeCell.connectsToEast = true; break;
					}
					
					// Set arrow if needed
					if (edge.arrowAtSender) {
						switch (senderDirection) {
							case 'N': senderEdgeCell.hasArrowSouth = true; break;
							case 'E': senderEdgeCell.hasArrowWest = true; break;
							case 'S': senderEdgeCell.hasArrowNorth = true; break;
							case 'W': senderEdgeCell.hasArrowEast = true; break;
						}
					}
				}
				
				// Debug log for sender attachment point
				console.log("\nSender attachment point properties:");
				console.log("Connections:");
				console.log(`  connectsToNorth: ${senderEdgeCell.connectsToNorth}`);
				console.log(`  connectsToEast:  ${senderEdgeCell.connectsToEast}`);
				console.log(`  connectsToSouth: ${senderEdgeCell.connectsToSouth}`);
				console.log(`  connectsToWest:  ${senderEdgeCell.connectsToWest}`);
				console.log("Arrows:");
				console.log(`  hasArrowNorth: ${senderEdgeCell.hasArrowNorth}`);
				console.log(`  hasArrowEast:  ${senderEdgeCell.hasArrowEast}`);
				console.log(`  hasArrowSouth: ${senderEdgeCell.hasArrowSouth}`);
				console.log(`  hasArrowWest:  ${senderEdgeCell.hasArrowWest}`);
				console.log(`\nHuman readable data string: ${senderEdgeCell.getHumanReadableDataString()}\n`);
				
				// Add sender cell to edge and update grid
				currentEdge.addCell(senderEdgeCell);
				this.grid[senderAttachmentPoint.row][senderAttachmentPoint.col] = senderEdgeCell;
				
				// Debug render after sender placement
				console.log("Grid after sender attachment:");
				console.log(this.renderAsASCII());
				console.log("\n");
			}

			// Step 2: Try to find receiver attachment point
			if (!receiverAttachmentPoint) {
				receiverAttachmentPoint = this.findValidAttachmentPoint(
					receiverNode,
					edge.cardinalPreferenceForReceiverAttachment
				);

				if (!receiverAttachmentPoint) {
					console.log("No valid receiver attachment point found, clearing sender and extending grid...");
					// Clear sender attachment
					if (senderAttachmentPoint && senderEdgeCell) {
						this.grid[senderAttachmentPoint.row][senderAttachmentPoint.col] = new EmptyCell();
						senderAttachmentPoint = null;
						senderEdgeCell = null;
					}
					// Clear the edge completely
					currentEdge.getCells().splice(0);
					this.extendRandomly();
					attempts++;
					continue;
				}

				console.log(`Found valid receiver attachment point at (${receiverAttachmentPoint.row}, ${receiverAttachmentPoint.col})`);
				
				// Create the receiver edge cell
				receiverEdgeCell = new EdgeCell();
				receiverEdgeCell.row = receiverAttachmentPoint.row;
				receiverEdgeCell.col = receiverAttachmentPoint.col;
				
				// Set connection and arrow properties for receiver
				const receiverDirection = this.getDirectionFromTo(receiverAttachmentPoint, receiverNode.getCoordinate());
				if (receiverDirection) {
					// Set connection towards receiver
					switch (receiverDirection) {
						case 'N': receiverEdgeCell.connectsToSouth = true; break;
						case 'E': receiverEdgeCell.connectsToWest = true; break;
						case 'S': receiverEdgeCell.connectsToNorth = true; break;
						case 'W': receiverEdgeCell.connectsToEast = true; break;
					}
					
					// Set arrow if needed
					if (edge.arrowAtReceiver) {
						switch (receiverDirection) {
							case 'N': receiverEdgeCell.hasArrowSouth = true; break;
							case 'E': receiverEdgeCell.hasArrowWest = true; break;
							case 'S': receiverEdgeCell.hasArrowNorth = true; break;
							case 'W': receiverEdgeCell.hasArrowEast = true; break;
						}
					}
				}
				
				// Debug log for receiver attachment point
				console.log("\nReceiver attachment point properties:");
				console.log("Connections:");
				console.log(`  connectsToNorth: ${receiverEdgeCell.connectsToNorth}`);
				console.log(`  connectsToEast:  ${receiverEdgeCell.connectsToEast}`);
				console.log(`  connectsToSouth: ${receiverEdgeCell.connectsToSouth}`);
				console.log(`  connectsToWest:  ${receiverEdgeCell.connectsToWest}`);
				console.log("Arrows:");
				console.log(`  hasArrowNorth: ${receiverEdgeCell.hasArrowNorth}`);
				console.log(`  hasArrowEast:  ${receiverEdgeCell.hasArrowEast}`);
				console.log(`  hasArrowSouth: ${receiverEdgeCell.hasArrowSouth}`);
				console.log(`  hasArrowWest:  ${receiverEdgeCell.hasArrowWest}`);
				console.log(`\nHuman readable data string: ${receiverEdgeCell.getHumanReadableDataString()}\n`);
				
				// Add receiver cell to edge and update grid
				currentEdge.addCell(receiverEdgeCell);
				this.grid[receiverAttachmentPoint.row][receiverAttachmentPoint.col] = receiverEdgeCell;
				
				// Debug render after receiver placement
				console.log("Grid after receiver attachment:");
				console.log(this.renderAsASCII());
				console.log("\n");
			}

			// Step 3: Try to find path between attachment points
			const path = this.findManhattanPath(senderAttachmentPoint!, receiverAttachmentPoint!);
			if (!path) {
				console.log("No valid path found between attachment points, clearing both attachments and extending grid...");
				// Clear both attachments
				if (senderAttachmentPoint) {
					this.grid[senderAttachmentPoint.row][senderAttachmentPoint.col] = new EmptyCell();
					senderAttachmentPoint = null;
					senderEdgeCell = null;
				}
				if (receiverAttachmentPoint) {
					this.grid[receiverAttachmentPoint.row][receiverAttachmentPoint.col] = new EmptyCell();
					receiverAttachmentPoint = null;
					receiverEdgeCell = null;
				}
				// Clear the edge completely
				currentEdge.getCells().splice(0);
				this.extendRandomly();
				attempts++;
				continue;
			}

			// Add path cells (excluding attachment points which are already placed)
			for (let i = 1; i < path.length - 1; i++) {
				const prevCoord = path[i - 1];
				const currentCoord = path[i];
				const nextCoord = path[i + 1];
				this.addPathCell(currentEdge, currentCoord, prevCoord, nextCoord);
			}
			
			// Debug render after path placement
			console.log("Grid after path placement:");
			console.log(this.renderAsASCII());
			console.log("\n");
			
			// Add the edge to the grid's edges array
			this.edges.push(currentEdge);
			console.log(`Edge placed successfully with both attachment points and path`);
			return;
		}

		console.error(`Failed to place edge after ${MAX_ATTEMPTS} attempts`);
	}

	private getDirectionFromTo(from: Coordinate, to: Coordinate): CardinalDirection | null {
		if (from.row === to.row) {
			if (from.col < to.col) return 'E';
			if (from.col > to.col) return 'W';
		}
		if (from.col === to.col) {
			if (from.row < to.row) return 'S';
			if (from.row > to.row) return 'N';
		}
		return null;
	}
}
