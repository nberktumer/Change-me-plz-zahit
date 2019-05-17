import {Clazz} from "../../project/Clazz";
import {FunctionalityFlow} from "../../flows/FunctionalityFlow";
import {FunctionalityFlowCode} from "../common/FunctionalityFlowCode";
import {Variable} from "../../../models/Variable";
import {ProgrammingLanguageTypeConverter} from "../ProgrammingLanguageTypeConverter";
import {ProgrammingLanguage, VariableType} from "../../../models";

export class JavaFunctionalityFlowCode implements FunctionalityFlowCode {

    generateMain(functionalityFlow: FunctionalityFlow, clazz: Clazz): void {
        if (!functionalityFlow.content) return

        const variableCount = functionalityFlow.content.variables.length

        let variableCode = ""
        functionalityFlow.content.variables.forEach((variable, index) => {
            if (variable.value) {
                const valueAsVariable = variable.value as Variable
                if (valueAsVariable.name) {
                    variableCode += valueAsVariable.name
                } else {
                    variableCode += ProgrammingLanguageTypeConverter.convertConstantVariable(ProgrammingLanguage.JAVA, valueAsVariable.value, valueAsVariable.type)
                }
            } else {
                variableCode += variable.name
            }

            if (index !== variableCount - 1) {
                variableCode += ", "
            }
        })

        const functionCallCode = `${functionalityFlow.content.clazzName}.${functionalityFlow.content.functionName}(${variableCode})`

        let variableSetCode = ""
        const assignVariable = functionalityFlow.content.assignVariable

        if (functionalityFlow.content.returnType !== VariableType.NONE && assignVariable.name) {
            if (clazz.addVariable(assignVariable.name)) {
                if (functionalityFlow.content.returnTypeIsArray) {
                    clazz.addDependency("import java.util.ArrayList;")
                    variableSetCode = "ArrayList<" + ProgrammingLanguageTypeConverter.convertType(ProgrammingLanguage.JAVA, assignVariable.type) + "> " + assignVariable.name
                } else {
                    variableSetCode = ProgrammingLanguageTypeConverter.convertType(ProgrammingLanguage.JAVA, assignVariable.type) + " " + assignVariable.name
                }
            } else {
                variableSetCode = assignVariable.name + " = "
            }
        }

        clazz.writeCodeToMainFunction(`${variableSetCode}${functionCallCode}`)

        clazz.writeMainCodeFromFlow(functionalityFlow.nextFlow())
    }

}
