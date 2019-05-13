import {CodeStrategy} from "../CodeStrategy";
import {Func} from "../../project/Func";
import {Clazz} from "../../project/Clazz";
import {JavaArithmeticFlowCode} from "./JavaArithmeticFlowCode";
import {JavaWhileFlowCode} from "./JavaWhileFlowCode";
import {JavaAssignmentFlowCode} from "./JavaAssignmentFlowCode";
import {JavaIfFlowCode} from "./JavaIfFlowCode";
import {JavaInputFlowCode} from "./JavaInputFlowCode";
import {JavaOutputFlowCode} from "./JavaOutputFlowCode";
import {JavaRandomFlowCode} from "./JavaRandomFlowCode";
import {Variable} from "../../../models/Variable";
import {Code} from "../Code";
import {DirectoryItemType} from "../../project/DirectoryItem";

export class JavaCodeStrategy implements CodeStrategy {

    arithmeticFlowCode = new JavaArithmeticFlowCode()
    assignmentFlowCode = new JavaAssignmentFlowCode()
    ifFlowCode = new JavaIfFlowCode()
    inputFlowCode = new JavaInputFlowCode()
    outputFlowCode = new JavaOutputFlowCode()
    randomFlowCode = new JavaRandomFlowCode()
    whileFlowCode = new JavaWhileFlowCode()

    initClazz(clazz: Clazz): void {
        clazz.incrementIndentation()
    }

    finishClazz(clazz: Clazz): void {
        clazz.decrementIndentation()
    }

    getClazzSignature(clazz: Clazz): string {
        return `public class ${clazz.name} {`
    }

    initMain(clazz: Clazz): void {
        const parameters: Variable[] = []
        const mainFunctionLines = new Code(clazz.indentationCount)

        if (clazz.type == DirectoryItemType.MAIN_CLASS) {
            mainFunctionLines.insert(`public static void main(String args[]) {`)
        } else {
            //TODO
        }

        mainFunctionLines.incrementIndentation()

        clazz.mainFunction = new Func(
            clazz.name,
            parameters,
            undefined,
            mainFunctionLines
        )
    }

    finishMain(clazz: Clazz): void {
        if (clazz.mainFunction == null)
            throw new Error("Main function is undefined!")

        clazz.mainFunction.code.decrementIndentation()
        clazz.mainFunction.code.insert("}")
        clazz.mainFunction.code.insert("")
    }

    initFunction(func: Func): void {
        let returnTypeString = ""
        if (func.returnType) {
            returnTypeString += `${func.returnType}`
        } else {
            returnTypeString += "void"
        }

        let parameterString = ""

        func.parameters.forEach((value, index) => {
            parameterString += `${value.type} ${value.name}`
            if (index !== func.parameters.length - 1) {
                parameterString += ", "
            }
        })

        func.code.insert(`private static ${returnTypeString} ${func.functionName}(${parameterString}) {`)
        func.code.incrementIndentation()
    }

    finishFunction(func: Func): void {
        func.code.decrementIndentation()
        func.code.insert("}")
        func.code.insert("")
    }
}
