import React from "react"
import {MenuItem, TextField} from "@material-ui/core"
import strings from "../../../lang"
import {BaseDialogBody, BaseDialogBodyProps} from "./BaseDialogBody"
import {VariableType} from "../../../models"
import {Rules} from "../../../config"

export class AddVariableDialogBody extends BaseDialogBody {

    constructor(props: BaseDialogBodyProps) {
        super(props)

        this.state = {
            variableName: "",
            variableType: "",
            value: ""
        }
    }

    render() {
        return (
            <div className="bodyContainer">
                <TextField
                    id="variable-name-input"
                    label={strings.variableName}
                    value={this.state.variableName}
                    inputProps={{maxLength: Rules.MAX_VAR_LENGTH}}
                    onChange={this.handleChange("variableName")}
                    margin="normal"
                />
                <TextField
                    id="data-type-selector"
                    select
                    label={strings.dataType}
                    value={this.state.variableType}
                    onChange={this.handleChange("variableType")}
                    margin="normal"
                >
                    <MenuItem key="__SELECT__" value="">
                        {strings.select}
                    </MenuItem>
                    {Object.keys(VariableType).map((key: any) => (
                        <MenuItem key={key} value={VariableType[key]}>
                            {VariableType[key]}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="value-input"
                    label={strings.value}
                    value={this.state.value}
                    inputProps={{maxLength: Rules.MAX_VAR_LENGTH}}
                    onChange={this.handleChange("value")}
                    margin="normal"
                />
            </div>
        )
    }
}
