import {Directory} from "./Directory"
import {MainClazz} from "./MainClazz"
import {ProgrammingLanguage} from "../../models"
import {DirectoryItemType} from "./DirectoryItem"
import {Clazz} from "./Clazz"
import {CodeStrategy} from "../code/CodeStrategy"
import {KotlinCodeStrategy} from "../code/kotlin/KotlinCodeStrategy"
import {CodeStrategyFactory} from "../code/CodeStrategyFactory"

export class Project {
    static codeStrategy: CodeStrategy = new KotlinCodeStrategy()
    static programmingLanguage: ProgrammingLanguage = ProgrammingLanguage.KOTLIN
    rootDirectory: Directory

    constructor() {
        this.rootDirectory = new Directory("src", [])
    }

    init(programmingLanguage: ProgrammingLanguage) {
        Project.programmingLanguage = programmingLanguage
        Project.codeStrategy = CodeStrategyFactory.createCodeStrategy(programmingLanguage)
        this.recursivelyGenerateClazzCodes(this.rootDirectory)
    }

    private recursivelyGenerateClazzCodes(directory: Directory) {
        directory.items.forEach((item) => {
            switch (item.type) {
                case DirectoryItemType.MAIN_CLASS:
                    const mainClazz = item as MainClazz
                    mainClazz.generateCode()
                    break
                case DirectoryItemType.CLASS:
                    const clazz = item as Clazz
                    clazz.generateCode()
                    break
                case DirectoryItemType.DIRECTORY:
                    const directory = item as Directory
                    this.recursivelyGenerateClazzCodes(directory)
                    break
            }
        })
    }

}
