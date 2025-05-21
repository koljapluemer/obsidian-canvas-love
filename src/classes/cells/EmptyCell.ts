import Cell, { CellType } from "./Cell";

export default class EmptyCell extends Cell {
	
		public getCellType(): CellType {
			return "emptyCell"
		}
	
		public renderAsASCII(): string {
			return "·"
		}
}
