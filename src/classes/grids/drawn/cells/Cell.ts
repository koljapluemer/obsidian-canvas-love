export type CellType = "emptyCell" | "nodeCell" | "edgeCell"

export default abstract class Cell {
	row: number
	col: number

	public abstract getCellType():CellType
	

	public abstract renderAsASCII():string;


	public isTraversable(): boolean {
		return this.getCellType() === "emptyCell";
	}

	public isEmpty(): boolean {
		return this.getCellType() === "emptyCell";
	}

	public clone(): Cell {
		return this;
	}

	public columnsThatContainMeAreAllowedToBeCloned(): boolean {
		return true;
	}

	public rowsThatContainMeAreAllowedToBeCloned(): boolean {
		return true;
	}
}
