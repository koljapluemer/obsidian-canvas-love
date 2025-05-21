export type CellType = "emptyCell" | "nodeCell" | "edgeCell"

export default abstract class Cell {
	row: number
	col: number

	public abstract getCellType():CellType

	public abstract renderAsASCII():string;
}
