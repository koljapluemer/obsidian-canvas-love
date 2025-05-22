import Cell, { CellType } from "./Cell";
import DrawnNode from "../DrawnNode";

export default class NodeCell extends Cell {
	private node: DrawnNode;

	constructor(node: DrawnNode) {
		super();
		this.node = node;
	}

	public getCellType(): CellType {
		return "nodeCell";
	}

	public renderAsASCII(): string {
		return "O";
	}

	public clone(): Cell {
		return new NodeCell(this.node);
	}
}
