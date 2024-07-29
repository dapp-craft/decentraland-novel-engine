import IButton from "../../sequence/i-button"
import IFrameCharacter from "./i-frame-character"
import IFrameParameters from "./i-frame-parameters"

export default interface IFrame {
    id: string
    technicalName: string
    parentSequence: string
    text: string
    speaker: string
    buttons: IButton[]
    characters: IFrameCharacter[]
    parameters: IFrameParameters
    action: string | undefined
    inputCondition: string | undefined
    menuText: string | undefined
}
