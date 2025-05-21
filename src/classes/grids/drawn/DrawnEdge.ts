import EdgeCell from "src/classes/cells/EdgeCell";
import ConfiguredEdge from "../configured/ConfiguredEdge";

export default class DrawnEdge {
	edgeToDraw: ConfiguredEdge
	cells: EdgeCell[]

	public handleRowDuplicationAtIndex(rowIndex:number) {}

	public handleColDuplicationAtIndex(colIndex:number) {}

	public evaluate():number {
		return 0
	}
}
