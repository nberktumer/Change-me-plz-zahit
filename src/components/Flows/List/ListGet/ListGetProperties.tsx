import React from "react"
import {MenuItem, TextField} from "@material-ui/core"
import strings from "../../../../lang"
import {BaseProperties, BasePropertiesProps, BasePropertiesState} from "../../Base/BaseProperties"
import {ListGetFlowNode} from "./ListGetFlowNode"
import {FlowConsumer} from "../../../../stores/FlowStore"
import _ from "lodash"
import {Variable} from "../../../../models/Variable"
import {VariableType} from "../../../../models"
import {Rules} from "../../../../config"
import {Validator} from "../../../../utils"
import InputWithType from "../../../InputWithType/InputWithType"

export interface AssignmentPropertiesProps extends BasePropertiesProps {
    readonlyType: boolean
}

export class ListGetProperties extends BaseProperties<AssignmentPropertiesProps> {
    static defaultProps = {
        readonlyType: false
    }

    constructor(props: AssignmentPropertiesProps) {
        super(props)

        if (props.node !== undefined) {
            const node = props.node as ListGetFlowNode

            this.state = {
                list: JSON.stringify(node.list),
                listType: node.list.listElementType,
                variable: JSON.stringify(node.variable),
                variableName: node.variable.name,
                assignToVariableStatus: "assign",
                initialIndexValue: node.index,
                index: node.index,
                isConstant: !Boolean(node.index.name)
            }
        } else {
            this.state = {
                list: "",
                listType: "",
                variable: "",
                variableName: "",
                assignToVariableStatus: "assign",
                initialIndexValue: "",
                index: "",
                isConstant: ""
            }
        }
    }

    componentWillUpdate(nextProps: Readonly<BasePropertiesProps>, nextState: Readonly<BasePropertiesState>, nextContext: any): void {
        if (this.props.isValidListener && nextState !== this.state) {
            this.props.isValidListener(!nextState.errorMessage
                && !nextState.errorField
                && nextState.list
                && nextState.variable
                && nextState.index)
        }
    }

    render() {
        return (
            <FlowConsumer>
                {(flowContext) => (
                    <div className="bodyContainer">
                        <TextField
                            id="data-type-selector"
                            select
                            fullWidth
                            label={strings.list}
                            value={this.state.list}
                            onChange={this.handleStringChange("list", () => {
                                this.setState({listType: (JSON.parse(this.state.list) as Variable).listElementType}, () => this.props.onDataChanged(this.state))
                            })}
                            margin="normal">
                            {_.concat(flowContext.variableList, flowContext.argList).filter((variable: Variable) => {
                                return variable.type === VariableType.LIST
                            }).map((variable: Variable) => (
                                <MenuItem key={variable.name} value={JSON.stringify(variable)}>
                                    {variable.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="data-type-selector"
                            select
                            fullWidth
                            disabled={this.props.readonlyType}
                            label={strings.createNewAndExistingVariable}
                            value={this.state.assignToVariableStatus}
                            onChange={this.handleStringChange("assignToVariableStatus", () => {
                                this.setState({variable: ""})
                            })}
                            margin="normal">
                            <MenuItem key={"new"} value={"new"}>
                                {strings.createNewVariable}
                            </MenuItem>
                            <MenuItem key={"assign"} value={"assign"}>
                                {strings.assignToVariable}
                            </MenuItem>
                        </TextField>
                        <TextField
                            id="variable-name-input"
                            fullWidth
                            disabled={this.props.readonlyType}
                            label={strings.variableName}
                            error={this.state.errorField === "variableName"}
                            style={{display: this.state.assignToVariableStatus === "new" ? "flex" : "none"}}
                            value={this.state.variableName}
                            inputProps={{maxLength: Rules.MAX_VAR_LENGTH}}
                            onChange={(e) => {
                                const error = Validator.validateVariableName(e.target.value, _.concat(flowContext.variableList, flowContext.argList))
                                this.setState({
                                    variableName: e.target.value,
                                    variable: e.target.value ? JSON.stringify(new Variable(e.target.value, this.state.listType, undefined)) : "",
                                    errorMessage: error,
                                    errorField: error ? "variableName" : ""
                                }, () => {
                                    this.props.onDataChanged(this.state)
                                })
                            }}
                            margin="normal"/>
                        <TextField
                            id="variable-selector"
                            select
                            fullWidth
                            disabled={this.props.readonlyType}
                            label={strings.assignToVariable}
                            value={this.state.variable}
                            style={{display: this.state.assignToVariableStatus === "new" ? "none" : "flex"}}
                            onChange={this.handleStringChange("variable")}
                            margin="normal">
                            {flowContext.variableList.filter((value) => {
                                return value.type === this.state.listType
                            }).map((value) => (
                                <MenuItem key={value.name} value={JSON.stringify(value)}>
                                    {value.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="data-type-selector"
                            select
                            fullWidth
                            label={strings.constantVariable}
                            value={this.state.isConstant}
                            onChange={this.handleStringChange("isConstant", () => {
                                this.setState({index: ""})
                            })}
                            margin="normal">
                            <MenuItem key={"constant"} value={"constant"}>
                                {strings.constant}
                            </MenuItem>
                            <MenuItem key={"variable"} value={"variable"}>
                                {strings.variable}
                            </MenuItem>
                        </TextField>

                        <TextField
                            id="variable-selector"
                            select
                            fullWidth
                            style={{display: this.state.isConstant === "constant" ? "none" : "flex"}}
                            label={strings.variable}
                            value={this.state.index}
                            onChange={this.handleStringChange("index")}
                            margin="normal">
                            {_.concat(flowContext.variableList, flowContext.argList)
                                .filter((variable) => variable.type === VariableType.INT)
                                .map((value) => (
                                    <MenuItem key={value.name} value={JSON.stringify(value)}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                        </TextField>

                        <InputWithType
                            variableType={VariableType.INT}
                            onDataChanged={(data: any) => {
                                this.setState({index: JSON.stringify(new Variable(undefined, VariableType.INT, data.value))}, () => {
                                    this.props.onDataChanged(this.state)
                                })
                            }}
                            label={strings.index}
                            value={this.state.initialIndexValue}
                            hide={this.state.isConstant !== "constant"}/>
                    </div>
                )}
            </FlowConsumer>
        )
    }
}
