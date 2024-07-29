import IManifest from "./interface/i-manifest"

export default class ManifestParser {
    public parse(manifestJson: any): IManifest {
        return {
            globalVariablesFileName: manifestJson.GlobalVariables.FileName,
            objectDefinitionsTypesFileName: manifestJson.ObjectDefinitions.Types.FileName,
            objectDefinitionsTextsFileName: manifestJson.ObjectDefinitions.Texts.FileName,
            packages: manifestJson.Packages.map((pkg: any) => {
                return {
                    localizationsFileName: pkg.Files.Texts.FileName,
                    objectsFileName: pkg.Files.Objects.FileName,
                    name: pkg.Name
                }
            })
        }
    }
}
