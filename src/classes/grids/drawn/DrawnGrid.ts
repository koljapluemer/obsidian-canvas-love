import Cell from "src/classes/cells/Cell";
import DrawnEdge from "./DrawnEdge";
import { Coordinate } from "src/classes/Coordinate";

export default class DrawnGrid {
	nodes: DrawnEdge[]
	edges: DrawnEdge[]

	width: number
	height: number

	constructor() {
		this.nodes = []
		this.edges = []
		this.width = 1
		this.height = 0
	}

	public getFlatCells():Cell[] {
		return []
	}

	public getRowAt(rowIndex:number): Cell[] {
		return []
	}

	public getColAt(colIndex:number): Cell[] {
		return []
	}

	public getCellAt(coord: Coordinate): Cell | undefined {
		return undefined
	}

	public isCellTraversableAt(coord: Coordinate): boolean {
		return false
	}

	public isCellEmptyAt(coord: Coordinate): boolean {
		return false
	}

	public isCellEmptyAndAllNeighborsAreEmptyAt(coord:Coordinate): boolean {
		return false
	}

	public cloneRowAt(rowIndex:number) {}

	public cloneColAt(colIndex:number) {}

	// TODO: move over relevant functions from the `-py` repo

	public saveToJSON() {}
	public static makeFromJSON() {}

	public evaluate():number {
		// call eval from nodes and edges here, compare again ogData
		// (and against other params)
		return 0
	}
}
