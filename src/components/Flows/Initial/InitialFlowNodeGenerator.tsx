import {BaseFlowNodeGenerator} from "../Base/BaseFlowNodeGenerator"
import {BaseFlowNode} from "../../CanvasItems/Nodes/BaseFlow/BaseFlowNode"
import {BasePropertiesState} from "../Base/BaseProperties"
import {InitialFlowNode} from "./InitialFlowNode"
import {Variable} from "../../../models/Variable"
import {VariableType} from "../../../models"

export class InitialFlowNodeGenerator extends BaseFlowNodeGenerator {
    create(data?: BasePropertiesState, node?: InitialFlowNode): BaseFlowNode | undefined {
        const initialFlow = new InitialFlowNode(data && data.returnType ? data.returnType : VariableType.NONE, data && data.returnListType ? data.returnListType : VariableType.NONE)

        if (data && data.args) {
            initialFlow.removeAllArguments()
            data.args.forEach((item: any) => {
                if (item.type === VariableType.LIST) {
                    initialFlow.addArgument(new Variable(item.name, item.type, undefined, item.listType))
                } else {
                    initialFlow.addArgument(new Variable(item.name, item.type, undefined))
                }
            })
        }

        return initialFlow
    }

    load(node: BaseFlowNode): BaseFlowNode {
        return new InitialFlowNode((node as InitialFlowNode).returnType, (node as InitialFlowNode).returnListType, true)
    }
}
