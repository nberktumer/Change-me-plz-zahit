import {Clazz} from "../../project/Clazz";
import {ProgrammingLanguageTypeConverter} from "../ProgrammingLanguageTypeConverter";
import {ProgrammingLanguage} from "../../../models";
import {ListSizeFlowCode} from "../common/ListSizeFlowCode";
import {ListSizeFlow} from "../../flows/ListSizeFlow";

export class JavaListSizeFlowCode implements ListSizeFlowCode {

    generateMain(listSizeFlow: ListSizeFlow, clazz: Clazz): void {
        if (!listSizeFlow.content) return

        clazz.addDependency("import java.util.ArrayList;")

        let setString = ""
        if (listSizeFlow.content.setToVariable.name) {
            if (clazz.addVariable(listSizeFlow.content.setToVariable.name)) {
                setString = `${ProgrammingLanguageTypeConverter.convertType(ProgrammingLanguage.JAVA, listSizeFlow.content.setToVariable.type)} ${listSizeFlow.content.setToVariable.name} `
            } else {
                setString = `${listSizeFlow.content.setToVariable.name} `
            }
        }

        clazz.writeCodeToMainFunction(`${setString}= ${listSizeFlow.content.list.name}.size();`)
        clazz.writeMainCodeFromFlow(listSizeFlow.nextFlow())
    }

}
