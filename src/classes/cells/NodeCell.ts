import DrawnNode from "../grids/drawn/DrawnNode";
import Cell, { CellType } from "./Cell";

export default class NodeCell extends Cell {
	
		node: DrawnNode

		public getCellType(): CellType {
			return "nodeCell"
		}
	
		public renderAsASCII(): string {
			return "□"
		}
}
