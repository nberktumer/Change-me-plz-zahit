import React from "react"
import {MenuItem, TextField} from "@material-ui/core"
import strings from "../../../lang"
import {BaseProperties, BasePropertiesProps, BasePropertiesState} from "../Base/BaseProperties"
import {VariableType} from "../../../models"
import InputWithType from "../../InputWithType/InputWithType"
import {Variable} from "../../../models/Variable"
import {FlowConsumer} from "../../../stores/FlowStore"
import _ from "lodash"
import {ReturnFlowNode} from "./ReturnFlowNode"
import {HOLDER} from "../../../bigNoNoPackage/ReturnTypeHolder"

export class ReturnFlowProperties extends BaseProperties<BasePropertiesProps> {

    constructor(props: BasePropertiesProps) {
        super(props)

        if (props.node !== undefined) {
            const node = props.node as ReturnFlowNode

            this.state = {
                variable: JSON.stringify(node.getVariable()),
                isConstant: node.getVariable() && !node.getVariable()!.name ? "constant" : "variable",
                initialValue: node.getVariable() ? node.getVariable()!.value : ""
            }
        } else {
            this.state = {
                variable: "",
                isConstant: "constant",
                initialValue: ""
            }
        }
    }

    componentWillUpdate(nextProps: Readonly<BasePropertiesProps>, nextState: Readonly<BasePropertiesState>, nextContext: any): void {
        if (this.props.isValidListener && nextState !== this.state) {
            this.props.isValidListener(!nextState.errorMessage
                && !nextState.errorField
                && ((nextState.isConstant === "constant" && nextState.variable && JSON.parse(nextState.variable).value)
                    || (nextState.isConstant !== "constant" && nextState.variable)
                ))
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
                            label={strings.constantVariable}
                            value={this.state.isConstant}
                            onChange={this.handleStringChange("isConstant", () => {
                                this.setState({variable: ""})
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
                            value={this.state.variable}
                            onChange={this.handleStringChange("variable")}
                            margin="normal">
                            {_.concat(flowContext.variableList, flowContext.argList).filter((item: Variable) => {
                                return item.type === HOLDER.ReturnType
                            }).map((value) => (
                                <MenuItem key={value.name} value={JSON.stringify(value)}>
                                    {value.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <InputWithType
                            variableType={HOLDER.ReturnType}
                            onDataChanged={(data: any) => {
                                this.setState({variable: JSON.stringify(new Variable(undefined, VariableType.STRING, data.value))}, () => {
                                    this.props.onDataChanged(this.state)
                                })
                            }}
                            value={this.state.initialValue}
                            hide={this.state.isConstant !== "constant"}/>
                    </div>
                )}
            </FlowConsumer>
        )
    }
}
