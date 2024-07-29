import IPackage from "./i-package"

export default interface IManifest {
    globalVariablesFileName: string
    objectDefinitionsTypesFileName: string
    objectDefinitionsTextsFileName: string
    packages: IPackage[]
}
