import {BaseFlowModelGenerator} from "../Base/BaseFlowModelGenerator"
import {FlowModel, FlowModelBuilder} from "../../../generator/FlowModelJSON"
import {BaseFlowNode} from "../../CanvasItems/Nodes/BaseFlow/BaseFlowNode"
import {FlowType} from "../../../models"
import {InitialFlowNode} from "./InitialFlowNode"

export class InitialFlowModelGenerator extends BaseFlowModelGenerator {
    generate(flow: BaseFlowNode): FlowModel {
        const initialFlow = flow as InitialFlowNode

        const nextFlow = initialFlow.getNextFlow()
        const nextFlowId = nextFlow ? nextFlow.getID() : null

        const flowModelBuilder = new FlowModelBuilder(FlowType.INITIAL, flow.getID(), nextFlowId)
        return flowModelBuilder.build()
    }
}
