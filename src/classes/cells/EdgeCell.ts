import DrawnEdge from "../grids/drawn/DrawnEdge";
import Cell, { CellType } from "./Cell";

export default class EdgeCell extends Cell {

	edge: DrawnEdge

	connectsToNorth : boolean
	connectsToEast : boolean
	connectsToSouth : boolean
	connectsToWest : boolean

	hasArrowNorth : boolean
	hasArrowEast : boolean
	hasArrowSouth : boolean
	hasArrowWest : boolean

	public getCellType(): CellType {
		return "edgeCell"
	}

	public renderAsASCII(): string {
		return "x"
	}	
}
