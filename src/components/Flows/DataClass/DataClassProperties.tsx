import React from "react"
import {
    Checkbox,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControlLabel,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import {BaseProperties, BasePropertiesProps, BasePropertiesState} from "../Base/BaseProperties"
import strings from "../../../lang"
import InputWithType from "../../InputWithType/InputWithType"
import {Variable} from "../../../models/Variable"
import {DataClassFlowNode} from "./DataClassFlowNode"
import {FlowConsumer} from "../../../stores/FlowStore"
import {DataClazz} from "../../../generator/project/DataClazz"

export class DataClassProperties extends BaseProperties<BasePropertiesProps> {

    constructor(props: BasePropertiesProps) {
        super(props)

        if (props.node !== undefined) {
            const node = props.node as DataClassFlowNode

            this.state = {
                fields: node.fieldList.map((item) => {
                    return {
                        field: item,
                        variable: JSON.stringify(item),
                        isConstant: !Boolean(item.name),
                        initialValue: !Boolean(item.name) ? item.value : ""
                    }
                }),
                selectedClass: JSON.stringify(new DataClazz(node.name, node.fieldList)),
                expanded: ""
            }
        } else {
            this.state = {
                fields: [],
                selectedClass: "",
                expanded: ""
            }
        }
    }

    componentWillUpdate(nextProps: Readonly<BasePropertiesProps>, nextState: Readonly<BasePropertiesState>, nextContext: any): void {
        if (this.props.isValidListener && nextState !== this.state) {
            this.props.isValidListener(!nextState.errorMessage
                && !nextState.errorField
                && nextState.fields
                && nextState.fields.every((item: any) => item.field && item.variable && JSON.parse(item.variable).value)
                && nextState.selectedClass)
        }
    }

    renderFieldText = (field: any) => {
        if (!field || !field.field)
            return strings.invalid

        if (!field.variable) {
            return `${field.field.name}: ${field.field.type}`
        } else {
            const variable = JSON.parse(field.variable)
            if (variable.value)
                return `${field.field.name}: ${field.field.type} = ${field.isConstant ? variable.value : variable.name}`
            else
                return `${field.field.name}: ${field.field.type}`
        }
    }

    render() {
        return (
            <FlowConsumer>
                {(flowContext) => (
                    <div className="bodyContainer">
                        <Paper id="paper"
                               style={{
                                   display: "flex",
                                   flex: 1,
                                   padding: 24,
                                   marginBottom: 8
                               }}>
                            <TextField
                                id="data-type-selector"
                                select
                                fullWidth
                                label={strings.dataClass}
                                value={this.state.selectedClass}
                                onChange={(e: any) => {
                                    const dataClass = JSON.parse(e.target.value) as DataClazz
                                    this.setState({
                                        selectedClass: e.target.value,
                                        fields: dataClass.variables.map((item) => {
                                            const isConstant = item.value !== undefined && item.value != null && item.value !== ""
                                            return {
                                                field: item,
                                                variable: isConstant ? JSON.stringify(new Variable(undefined, item.type, item.value)) : "",
                                                isConstant,
                                                initialValue: isConstant ? item.value : ""
                                            }
                                        })
                                    }, () => {
                                        this.props.onDataChanged(this.state)
                                    })
                                }}
                                margin="normal">
                                {flowContext.dataClassList.map((value) => (
                                    <MenuItem key={value.name} value={JSON.stringify(value)}>
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Paper>
                        {this.state.fields.map((field: any, index: number) => (
                            <ExpansionPanel id="paper"
                                            key={index}
                                            expanded={this.state.expanded === index}
                                            onChange={(e, expanded) => {
                                                this.setState({
                                                    expanded: expanded ? index : -1
                                                })
                                            }}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                    <Typography>
                                        {this.renderFieldText(field)}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row"
                                    }}>
                                        <TextField
                                            id="data-type-selector"
                                            select
                                            style={{
                                                flex: 1,
                                                display: this.state.fields[index].isConstant ? "none" : "flex"
                                            }}
                                            label={strings.variable}
                                            value={this.state.fields[index].variable}
                                            onChange={(e: any) => {
                                                this.state.fields[index].variable = e.target.value
                                                this.setState({fields: this.state.fields})
                                                this.props.onDataChanged(this.state)
                                            }}
                                            margin="normal">
                                            {flowContext.variableList.filter((value) => {
                                                return value.type === field.field.type
                                            }).map((value) => (
                                                <MenuItem key={value.name} value={JSON.stringify(value)}>
                                                    {value.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <InputWithType
                                            variableType={this.state.fields[index].field.type}
                                            onDataChanged={(data: any) => {
                                                this.state.fields[index].variable = JSON.stringify(new Variable(undefined, this.state.fields[index].field.type, data.value))
                                                this.setState({fields: this.state.fields})
                                                this.props.onDataChanged(this.state)
                                            }}
                                            value={this.state.fields[index].initialValue}
                                            hide={!this.state.fields[index].isConstant}/>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.fields[index].isConstant}
                                                    onChange={(e: any) => {
                                                        this.state.fields[index].isConstant = e.target.checked
                                                        this.state.fields[index].variable = null
                                                        this.setState({fields: this.state.fields})
                                                        this.props.onDataChanged(this.state)
                                                    }}
                                                    value="true"
                                                    color="primary"
                                                />
                                            }
                                            label={this.state.fields[index].isConstant ? strings.constant : strings.variable}
                                        />
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        ))}
                    </div>
                )}
            </FlowConsumer>
        )
    }
}
