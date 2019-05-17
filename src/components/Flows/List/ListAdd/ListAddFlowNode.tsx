import {Variable} from "../../../../models/Variable"
import {FlowType} from "../../../../models"
import strings from "../../../../lang"
import {NodeColors} from "../../../../config"
import {BaseFlowNode} from "../../../CanvasItems/Nodes/BaseFlow/BaseFlowNode"
import {DiagramEngine} from "nberktumer-react-diagrams"
import * as _ from "lodash"

export class ListAddFlowNode extends BaseFlowNode {
    list: Variable
    variable: Variable

    constructor(list: Variable, variable: Variable, withoutPorts: boolean = false) {
        super(FlowType.LIST_ADD, strings.addToList + " (" + variable.type + ")", NodeColors.LIST_ADD)

        this.list = list
        this.variable = variable
        this.setList(list)
        this.setVariable(variable)

        if (!withoutPorts) {
            this.addInPort(strings.in).setMaximumLinks(1)
            this.addOutPort(strings.out).setMaximumLinks(1)
        }
    }

    setList(list: Variable) {
        this.list = list
        this.updateInfo()
    }

    setVariable(variable: Variable) {
        this.variable = variable
        this.updateInfo()
    }

    updateInfo() {
        this.info = `Insert ${this.variable.name ? this.variable.name : this.variable.value} to ${this.list.name}`
    }

    deSerialize(object: any, engine: DiagramEngine) {
        super.deSerialize(object, engine)
        this.list = object.list
        this.variable = object.variable
    }

    serialize() {
        return _.merge(super.serialize(), {
            list: this.list,
            variable: this.variable
        })
    }
}
