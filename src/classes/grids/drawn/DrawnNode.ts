import NodeCell from "src/classes/cells/NodeCell"
import ConfiguredNode from "../configured/ConfiguredNode"

export default class DrawnNode {
	nodeToDraw: ConfiguredNode
	cells: NodeCell[]

	public handleRowDuplicationAtIndex(rowIndex:number) {}

	public handleColDuplicationAtIndex(colIndex:number) {}

	public evaluate():number {
		return 0
	}
}
