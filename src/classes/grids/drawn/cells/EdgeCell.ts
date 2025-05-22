import DrawnEdge from "../DrawnEdge";
import Cell, { CellType } from "./Cell";



export default class EdgeCell extends Cell {

	edge: DrawnEdge

	connectsToNorth: boolean
	connectsToEast: boolean
	connectsToSouth: boolean
	connectsToWest: boolean

	hasArrowNorth: boolean
	hasArrowEast: boolean
	hasArrowSouth: boolean
	hasArrowWest: boolean

	constructor() {
		super();
		this.connectsToNorth = false;
		this.connectsToEast = false;
		this.connectsToSouth = false;
		this.connectsToWest = false;
		this.hasArrowNorth = false;
		this.hasArrowEast = false;
		this.hasArrowSouth = false;
		this.hasArrowWest = false;
	}

	public getCellType(): CellType {
		return "edgeCell"
	}

	public columnsThatContainMeAreAllowedToBeCloned(): boolean {
		return this.renderAsASCII() === "—"
	}

	public rowsThatContainMeAreAllowedToBeCloned(): boolean {
		return this.renderAsASCII() === "|"
	}

	public isVerticallyTraversable(): boolean {
		return this.renderAsASCII() === "—"
	}

	public isHorizontallyTraversable(): boolean {
		return this.renderAsASCII() === "|"
	}


	public getHumanReadableDataString(): string {
		const dataString = "----_----"
		const chars = dataString.split('')

		if (this.connectsToNorth) {
			chars[0] = "N"
		}
		if (this.connectsToEast) {
			chars[1] = "E"
		}
		if (this.connectsToSouth) {
			chars[2] = "S"
		}
		if (this.connectsToWest) {
			chars[3] = "W"
		}

		if (this.hasArrowNorth) {
			chars[5] = "n"
		}
		if (this.hasArrowEast) {
			chars[6] = "e"
		}
		if (this.hasArrowSouth) {
			chars[7] = "s"
		}
		if (this.hasArrowWest) {
			chars[8] = "w"
		}

		return chars.join('')
	}

	public renderAsASCII(): string {
		const pattern = this.getHumanReadableDataString()
		switch (pattern) {
			case "-E-W_----": return "—"
			case "-E-W_-e--": return "→"
			case "-E-W_---w": return "←"
			case "N-S-_----": return "|"
			case "N-S-_n---": return "↑"
			case "N-S-_--s-": return "↓"
			case "NESW_----": return "🞡"
			default: return "~"
		}
	}	
}
