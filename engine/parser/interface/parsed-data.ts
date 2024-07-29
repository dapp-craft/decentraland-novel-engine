import ICharacter from "./i-character"
import ISequence from "./i-sequence"
import IUnknownNode from "./i-unknown-node"
import IVariableNamespace from "./i-variable-namespace"

export default interface IParsedData {
    sequences: ISequence[]
    characters: ICharacter[]
    variables: IVariableNamespace[]
    unknownNodes: IUnknownNode[]
}
