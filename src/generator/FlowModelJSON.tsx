import {ArithmeticFlowContent} from "./flows/ArithmeticFlow"
import {OutputFlowContent} from "./flows/OutputFlow"
import {InputFlowContent} from "./flows/InputFlow"
import {AssignmentFlowContent} from "./flows/AssignmentFlow"
import {WhileFlowContent} from "./flows/WhileFlow"
import {FlowType} from "../models"

export class FlowModel {
    type: FlowType
    id: number
    assignmentFlowContent: AssignmentFlowContent | null
    inputFlowContent: InputFlowContent | null
    outputFlowContent: OutputFlowContent | null
    arithmeticFlowContent: ArithmeticFlowContent | null
    whileFlowContent: WhileFlowContent | null
    // forFlowContent: ForFlowContent,
    // ifFlowContent: IfFlowContent,
    nextFlowId: number

    constructor(
        type: FlowType,
        id: number,
        assignmentFlowContent: AssignmentFlowContent | null = null,
        inputFlowContent: InputFlowContent | null = null,
        outputFlowContent: OutputFlowContent | null = null,
        arithmeticFlowContent: ArithmeticFlowContent | null = null,
        whileFlowContent: WhileFlowContent | null = null,
        nextFlowId: number
        // forFlowContent: ForFlowContent,
        // ifFlowContent: IfFlowContent,

    ) {
        this.type = type
        this.id = id
        this.assignmentFlowContent = assignmentFlowContent
        this.inputFlowContent = inputFlowContent
        this.outputFlowContent = outputFlowContent
        this.arithmeticFlowContent = arithmeticFlowContent
        this.whileFlowContent = whileFlowContent
        this.nextFlowId = nextFlowId
    }
}
