import {ArithmeticFlowContent} from "./flows/ArithmeticFlow";
import {OutputFlowContent} from "./flows/OutputFlow";
import {InputFlowContent} from "./flows/InputFlow";
import {AssignmentFlowContent} from "./flows/AssignmentFlow";
import {WhileFlowContent} from "./flows/WhileFlow";

export class FlowModel {
    type: string
    id: number
    assignmentFlowContent: AssignmentFlowContent
    inputFlowContent: InputFlowContent
    outputFlowContent: OutputFlowContent
    arithmeticFlowContent: ArithmeticFlowContent
    whileFlowContent: WhileFlowContent
    // forFlowContent: ForFlowContent,
    // ifFlowContent: IfFlowContent,

    constructor(
        type: string,
        id: number,
        assignmentFlowContent: AssignmentFlowContent,
        inputFlowContent: InputFlowContent,
        outputFlowContent: OutputFlowContent,
        arithmeticFlowContent: ArithmeticFlowContent,
        whileFlowContent: WhileFlowContent
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
    }
}
