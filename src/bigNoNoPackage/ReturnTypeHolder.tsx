import {VariableType} from "../models"
import {Clazz} from "../generator/project/Clazz"
import {DirectoryItemType} from "../generator/project/DirectoryItem"

export const HOLDER = {
    ReturnType: VariableType.NONE,
    classList: [],
    currentClass: new Clazz(DirectoryItemType.MAIN_CLASS, "", [])
}
