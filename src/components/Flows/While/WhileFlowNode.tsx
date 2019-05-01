import {BaseInfoFlowNode} from "../../CanvasItems/Nodes/BaseInfoFlow/BaseInfoFlowNode"
import strings from "../../../lang"
import {NodeColors} from "../../../config"
import {DiagramEngine} from "nberktumer-react-diagrams"
import * as _ from "lodash"
import {Condition} from "../../../models/Condition"
import {BaseFlowNode} from "../../CanvasItems/Nodes/BaseFlow/BaseFlowNode"
import {DefaultPortType} from "../../CanvasItems/Ports/DefaultPort"
import {FlowType} from "../../../models"
import {Variable} from "../../../models/Variable"
import {SignConverter} from "../../../utils"
import {ConditionType} from "../../../models/VariableEnums"

export class WhileFlowNode extends BaseInfoFlowNode {
    conditionList: Condition[] = []
    conditionType: ConditionType = ConditionType.AND

    constructor(withoutPorts: boolean = false) {
        super(FlowType.WHILE, strings.while, NodeColors.WHILE)

        if (!withoutPorts) {
            this.addInPort(strings.in).setMaximumLinks(1)
            this.addOutPort(strings.out).setMaximumLinks(1)
            this.addScopePort(strings.scope).setMaximumLinks(1)
        }
    }

    updateInfo = () => {
        this.info = this.conditionList.map((condition) => {
            return `${condition.first.name} ${SignConverter.booleanOperation(condition.operation)} ${condition.second ? (condition.second.name ? condition.second.name : condition.second.value) : ""}`
        }).join(` ${this.conditionType} `)
    }

    setConditionType(conditionType: ConditionType) {
        this.conditionType = conditionType
        this.updateInfo()
    }

    getConditionType(): ConditionType {
        return this.conditionType
    }

    addCondition(condition: Condition) {
        this.conditionList.push(condition)
        this.updateInfo()
    }

    removeAllConditions() {
        this.conditionList = []
        this.updateInfo()
    }

    removeCondition(condition: Condition) {
        this.conditionList = this.conditionList.filter((cond) => cond !== condition)
        this.updateInfo()
    }

    updateVariableInConditions = (oldVariable: Variable, newVariable: Variable) => {
        this.conditionList.forEach((cond) => {
            if (cond.first.name === oldVariable.name) {
                cond.first = newVariable
            }
            if (cond.second && cond.second.name && cond.second.name === oldVariable.name) {
                cond.second = newVariable
            }
        })
        this.updateInfo()
    }

    deSerialize(object: any, engine: DiagramEngine) {
        super.deSerialize(object, engine)
        this.conditionList = object.conditionList
        this.conditionType = object.conditionType
    }

    serialize() {
        return _.merge(super.serialize(), {
            conditionList: this.conditionList,
            conditionType: this.conditionType
        })
    }

    getScopeFlow(): BaseFlowNode | null {
        const links = Object.values(this.getPortListByType(DefaultPortType.SCOPE)[0].getLinks())

        if (links.length > 0) {
            return links[0].getTargetPort().getNode() as BaseFlowNode
        } else {
            return null
        }
    }
}
