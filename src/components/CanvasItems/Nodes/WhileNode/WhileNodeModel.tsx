import {RectangleNodeWithInfoModel} from "../BaseNodes/RectangleNode/RectangleNodeWithInfo/RectangleNodeWithInfoModel"
import strings from "../../../../lang"
import {NodeColors} from "../../../../config"
import {DiagramEngine} from "storm-react-diagrams"
import * as _ from "lodash"
import {Condition} from "../../../../models/Condition"

export class WhileNodeModel extends RectangleNodeWithInfoModel {
    conditionList: Condition[] = []

    constructor() {
        super(strings.while, NodeColors.WHILE)

        this.addInPort(strings.in).setMaximumLinks(Infinity)
        this.addInPort(strings.loop).setMaximumLinks(Infinity)
        this.addOutPort(strings.out).setMaximumLinks(1)
        this.addOutPort(strings.scope).setMaximumLinks(1)
    }

    deSerialize(object: any, engine: DiagramEngine) {
        super.deSerialize(object, engine)
        this.conditionList = object.conditionList
    }

    serialize() {
        return _.merge(super.serialize(), {
            conditionList: this.conditionList
        })
    }
}
