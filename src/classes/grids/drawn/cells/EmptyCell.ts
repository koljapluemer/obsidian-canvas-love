import Cell, { CellType } from "./Cell";

export default class EmptyCell extends Cell {
	constructor() {
		super();
	}
	
	public getCellType(): CellType {
		return "emptyCell"
	}
	
	public renderAsASCII(): string {
		return "·"
	}

	public clone(): Cell {
		return new EmptyCell();
	}

	public isVerticallyTraversable(): boolean {
		return true;
	}

	public isHorizontallyTraversable(): boolean {
		return true;
	}
}
