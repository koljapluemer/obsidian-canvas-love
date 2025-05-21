import AbstractNode from "./AbstractNode"

export default class AbstractEdge {
	ogData: any
	sender: AbstractNode
	receiver: AbstractNode
	label: string
	arrowAtSender: boolean
	arrowAtReceiver: boolean
}
