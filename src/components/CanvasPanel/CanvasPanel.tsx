import React, {Component} from "react"
import styles from "./CanvasPanel.module.css"
import * as _ from "lodash"
import {BaseEvent, BaseModel, DiagramEngine, DiagramModel, DiagramWidget, NodeModel} from "nberktumer-react-diagrams"
import {FlowType} from "../../models"
import {PortFactory} from "../CanvasItems/Ports/PortFactory"
import {BaseFlowFactory} from "../CanvasItems/Nodes/BaseFlow/BaseFlowFactory"
import {BaseInfoFlowFactory} from "../CanvasItems/Nodes/BaseInfoFlow/BaseInfoFlowFactory"
import {BasePropertiesState} from "../Flows/Base/BaseProperties"
import {DefaultPort, DefaultPortLocation, DefaultPortModel, DefaultPortType} from "../CanvasItems/Ports/DefaultPort"
import {Variable} from "../../models/Variable"
import {InitialFlowNode} from "../Flows/Initial/InitialFlowNode"
import {FlowNodeFactory} from "../Flows"
import {BaseFlowNode} from "../CanvasItems/Nodes/BaseFlow/BaseFlowNode"

export interface CanvasPanelProps {
    variableList: Variable[]
    onDrop: (type: FlowType, position: { x: number, y: number }) => void,
    onDiagramChanged: () => void,
    onSelectionChanged: (event: BaseEvent<BaseModel> & { isSelected: boolean }) => void,
    onEntityRemoved: (event: BaseEvent<BaseModel>) => void,
    onItemAdded: (flow: BaseFlowNode) => void
}

export interface CanvasPanelState {
}

export default class CanvasPanel extends Component<CanvasPanelProps, CanvasPanelState> {
    activeModel: DiagramModel
    diagramEngine: DiagramEngine
    initialNode: InitialFlowNode

    constructor(props: CanvasPanelProps) {
        super(props)
        this.diagramEngine = new DiagramEngine()
        this.activeModel = new DiagramModel()
        this.initialNode = FlowNodeFactory.create(FlowType.INITIAL, undefined) as InitialFlowNode

        this.new()
    }

    new = () => {
        this.diagramEngine = new DiagramEngine()
        this.diagramEngine.installDefaultFactories()

        this.diagramEngine.registerNodeFactory(new BaseFlowFactory())
        this.diagramEngine.registerNodeFactory(new BaseInfoFlowFactory())
        this.diagramEngine.registerPortFactory(new PortFactory("default", () => new DefaultPortModel(
            new DefaultPort(DefaultPortType.IN, DefaultPortLocation.LEFT), "unknown")))

        this.activeModel = new DiagramModel()
        this.diagramEngine.setDiagramModel(this.activeModel)

        this.initialNode = FlowNodeFactory.create(FlowType.INITIAL, undefined) as InitialFlowNode
        this.initialNode.addListener({
            selectionChanged: this.props.onSelectionChanged.bind(this),
            entityRemoved: this.props.onEntityRemoved.bind(this)
        })

        this.initialNode.x = window.innerWidth * 0.1
        this.initialNode.y = window.innerHeight * 0.4

        this.diagramEngine.getDiagramModel().addNode(this.initialNode)
    }

    save = () => {
        const diagram = this.activeModel.serializeDiagram() as { [k: string]: any }
        diagram.canvasPanel = {
            variableList: this.props.variableList,
            initialNodeId: this.initialNode.getID()
        }
        return diagram
    }

    load = (data: string, onLoad: (props: any) => void) => {
        const diagram = JSON.parse(data)

        const model = new DiagramModel()
        model.deSerializeDiagram(diagram, this.diagramEngine)

        _.forEach(model.getNodes(), (node: NodeModel) => {
            node.addListener({
                selectionChanged: (e: BaseEvent<BaseModel> & { isSelected: boolean }) => this.props.onSelectionChanged(e),
                entityRemoved: (e: BaseEvent<BaseModel>) => this.props.onEntityRemoved(e)
            });
            (node as BaseFlowNode).addOnLinkChangedListener(this.props.onDiagramChanged)
        })

        this.diagramEngine.setDiagramModel(model)
        this.activeModel = model
        this.initialNode = model.getNode(diagram.canvasPanel.initialNodeId) as InitialFlowNode

        onLoad(diagram.canvasPanel.variableList)
        this.forceUpdate()
    }

    addItem = (type: FlowType, data: BasePropertiesState, position: { x: number, y: number }): void => {
        const node = FlowNodeFactory.create(type, data)
        if (!node)
            return

        node.x = position.x
        node.y = position.y

        node.addOnLinkChangedListener(this.props.onDiagramChanged)
        node.addListener({
            selectionChanged: (e: BaseEvent<BaseModel> & { isSelected: boolean }) => this.props.onSelectionChanged(e),
            entityRemoved: (e: BaseEvent<BaseModel>) => this.props.onEntityRemoved(e)
        })

        this.diagramEngine.getDiagramModel().addNode(node)

        this.props.onItemAdded(node)
        this.forceUpdate()
    }

    render() {
        return (
            <div
                className={styles.diagramLayer}
                onDrop={(event) => this.onDrop(event)}
                onDragOver={(event) => event.preventDefault()}>

                <DiagramWidget
                    maxNumberPointsPerLink={0}
                    allowLooseLinks={false}
                    className={styles.srdDemoCanvas}
                    diagramEngine={this.diagramEngine}/>
            </div>
        )
    }

    private onDrop(event: any): void {
        const data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"))

        if (!Object.values(FlowType).includes(data.type))
            return

        const points = this.diagramEngine.getRelativeMousePoint(event)

        this.props.onDrop(data.type, points)
    }
}
