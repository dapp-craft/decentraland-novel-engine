import ICharacter from "./interface/i-character"
import IFrame from "./interface/i-frame"
import IFrameCharacter from "./interface/i-frame-character"
import ISequence from "./interface/i-sequence"
import IParsedData from "./interface/parsed-data"
import IButton from "../sequence/i-button"
import ICondition from "./interface/i-condition"
import IVariable from "./interface/i-variable"
import IAudioAsset from "./interface/assets/i-audio"
import NodeType from "./enum/enum-type-node"
import IImageAsset from "./interface/assets/i-image"
import BubbleSpeech from "./enum/enum-bubble-speech"
import IJump from "./interface/i-jump"
import IPin from "./interface/i-pin"
import IObjectDefinition from "./interface/i-object-definition"
import IHookNode from "./interface/i-hook-node"

let _animationsAllCharacters: { [key: number]: string } = {}
let _audioAssets: IAudioAsset[] = []
let _imageAssets: IImageAsset[] = []
let _localizations: { [key: string]: string } = {}

export function getLocalization(key: string): string {
    return _localizations[key]
}

export default class Parser {
    private _globalVariablesJson: any
    private _objectDefinitionsTypesJson: any
    private _objectDefinitionsTextsJson: any
    private _packageObjectsJson: any
    private _packageLocalizationsJson: any
    private _objectDefinitions: IObjectDefinition[] = []
    private _hook: (node: IHookNode, packageId: string) => void

    private _parsedData: IParsedData = {
        sequences: [],
        characters: [],
        variables: [],
        unknownNodes: []
    }

    private _partIndex: number = 0

    private _jumps: IJump[] = []

    private _pins: IPin[] = []

    constructor(
        globalVariablesJson: any,
        objectDefinitionsTypesJson: any,
        objectDefinitionsTextsJson: any,
        packageObjectsJson: any,
        packageLocalizationsJson: any,
        index: number,
        hook: (node: IHookNode, packageId: string) => void
    ) {
        this._globalVariablesJson = globalVariablesJson
        this._objectDefinitionsTypesJson = objectDefinitionsTypesJson
        this._objectDefinitionsTextsJson = objectDefinitionsTextsJson
        this._packageObjectsJson = packageObjectsJson
        this._packageLocalizationsJson = packageLocalizationsJson
        this._partIndex = index
        this._hook = hook
    }

    private _findJumpDestination(target: string): string {
        let foundSequence: ISequence | undefined
        let foundFrame
        let foundCondition

        for (let sequence of this._parsedData.sequences) {
            if (sequence.id === target) {
                foundSequence = sequence
                break
            }
            for (let frame of sequence.frames) {
                if (frame.id === target) {
                    foundFrame = frame
                    break
                }
                for (let condition of sequence.conditions) {
                    if (condition.id === target) {
                        foundCondition = condition
                        break
                    }
                }
            }
        }

        if (foundFrame) {
            return foundFrame.id
        } else if (foundCondition) {
            return foundCondition.id
        } else if (foundSequence) {
            return foundSequence.firstFrame
        } else {
            // console.log("No target found for jump " + target);
            return ""
        }
    }

    parse(packageName: string): IParsedData {
        // console.log("STARTING PARSING MODELS")
        this._preParse(packageName)
        // console.log("STARTING LOCALIZATION PARSE");
        this._localizationParse()

        // console.log("STARTING PARSING PACKAGES");
        this._postParse(packageName)

        // console.log("MODELS PARSED");

        //  // console.log("STARTING PARSING JUMPS");
        //  // console.log(this._jumps);

        for (let sequence of this._parsedData.sequences) {
            for (let frame of sequence.frames) {
                for (let button of frame.buttons) {
                    let buttonTarget = button.targetFrame
                    let jump = this._jumps.find(j => j.id === buttonTarget)
                    if (jump) {
                        let destination = this._findJumpDestination(jump.destination)
                        button.targetFrame = destination
                    }
                }
            }
            for (let condition of sequence.conditions) {
                let trueTarget = condition.trueFrame
                let falseTarget = condition.falseFrame
                let jumpTrue = this._jumps.find(j => j.id === trueTarget)
                let jumpFalse = this._jumps.find(j => j.id === falseTarget)
                if (jumpTrue) {
                    let destination = this._findJumpDestination(jumpTrue.destination)
                    condition.trueFrame = destination
                }
                if (jumpFalse) {
                    let destination = this._findJumpDestination(jumpFalse.destination)
                    condition.falseFrame = destination
                }
            }
        }

        return this._parsedData
    }

    public findBaseClass(type: string): string | undefined {
        let objectDefinition = this._objectDefinitions.find(o => o.type === type)
        if (objectDefinition == undefined) {
            return undefined
        }
        if (objectDefinition.class == objectDefinition.type) {
            return objectDefinition.class
        }
        return this.findBaseClass(objectDefinition.class)
    }

    private _preParse(packageName: string) {
        let globalVariables = this._globalVariablesJson.GlobalVariables
        let objectDefinitions = this._objectDefinitionsTypesJson.ObjectDefinitions

        for (let definition of objectDefinitions) {
            let newDefinition = {
                type: definition.Type,
                class: definition.Class
            }
            this._objectDefinitions.push(newDefinition)

            switch (definition.Type) {
                case "animationsAllCharacters":
                    let values = definition.Values
                    for (let key of Object.keys(values)) {
                        _animationsAllCharacters[parseInt(values[key])] = key
                    }
                    break
            }
        }

        // console.log("OBJECT DEFINITIONS");
        // console.log(this._objectDefinitions);

        for (let variableNamespace of globalVariables) {
            let variables = variableNamespace.Variables
            let parsedVariables = variables.map((variable: any) => {
                switch (variable.Type) {
                    case "Boolean":
                        return {
                            name: variable.Variable,
                            value: variable.Value == "True",
                            type: "boolean"
                        }
                    case "Integer":
                        return {
                            name: variable.Variable,
                            value: parseInt(variable.Value),
                            type: "number"
                        }
                }
            })
            // upsert
            let existingNamespace = this._parsedData.variables.find(v => v.namespace === variableNamespace.Namespace)
            if (existingNamespace == undefined) {
                this._parsedData.variables.push({
                    namespace: variableNamespace.Namespace,
                    variables: parsedVariables
                })
            } else {
                for (let variable of parsedVariables) {
                    if (existingNamespace.variables.find(v => v.name === variable.name) == undefined) {
                        existingNamespace.variables.push(variable)
                    }
                }
            }
        }
    }

    private _localizationParse() {
        for (let localizationKey in this._packageLocalizationsJson) {
            _localizations[localizationKey] = this._packageLocalizationsJson[localizationKey][""]["Text"]
        }
    }

    private _postParse(packageName: string) {
        let models = this._packageObjectsJson.Objects
        // console.log(models)
        for (let model of models) {
            let modelType = model.Type
            let modelBaseClass = this.findBaseClass(modelType)
            if (modelBaseClass == "Asset") {
                switch (model.Category) {
                    case "Audio":
                        if (_audioAssets.find(a => a.id === model.Properties.Id) == undefined) {
                            _audioAssets.push(this._parseAudioAsset(model, packageName))
                        }
                        break
                    case "Image":
                        if (_imageAssets.find(a => a.id === model.Properties.Id) == undefined) {
                            _imageAssets.push(this._parseImageAsset(model, packageName))
                        }
                        break
                }
            }
        }

        for (let model of models) {
            try {
                this._parsePins(model)
            } catch (e) {
                // console.log("Pin parse failed");
                // console.log(e);
            }
        }

        for (let model of models) {
            let modelType = model.Type
            let modelBaseClass = this.findBaseClass(modelType)

            switch (modelBaseClass) {
                case "Dialogue":
                    const seq = this._parseDialogue(model, packageName)
                    //// console.log("RECEIVED seq id=" + seq.id);
                    this._parsedData.sequences.push(seq)
                    break
                case "DialogueFragment":
                    let frame: IFrame
                    try {
                        frame = this._parseDialogueFragmentTemplate(model, packageName)
                        let sequence = this._parsedData.sequences.find(s => s.id === frame.parentSequence)
                        if (sequence) {
                            sequence.frames.push(frame)
                        } else {
                            // console.log("No sequence found for frame " + frame.id);
                        }
                        if (
                            this._parsedData.sequences.find(s => s.id === frame.parentSequence)?.frames.find(frame => frame.id == frame.id)
                        ) {
                        } else {
                            this._parsedData.sequences.find(s => s.id === frame.parentSequence)?.frames.push(frame)
                        }
                    } catch (e) {
                        // console.log("Error parsing frame " + model.Properties.Id);
                    }
                    break
                case "Entity":
                    if (modelType == "characterProperties") {
                        // console.log("Entity" + model.Properties.Id)
                        let entity = this._parseEntity(model, packageName)
                        // console.log(entity);
                        if (this._parsedData.characters.find(c => c.id === entity.id) == undefined) {
                            this._parsedData.characters.push(entity)
                        }
                    } else {
                        this._saveUnknownNode(model, packageName)
                    }
                    break
                case "Condition":
                    try {
                        const condition = this._parseCondition(model, packageName)
                        // console.log(condition);

                        this._parsedData.sequences.find(s => s.id === condition.parentSequence)?.conditions.push(condition)
                    } catch (e) {
                        // console.log("Error parsing condition " + model.Properties.Id);
                        // console.log(e)
                    }
                    break
                case "Jump":
                    this._jumps.push(this._parseJump(model, packageName))
                    break
                default:
                    this._saveUnknownNode(model, packageName)
                    break
            }
        }

        // console.log(this._parsedData);
    }

    private _saveUnknownNode(model: any, packageName: string) {
        this._parsedData.unknownNodes.push({
            id: model.Properties.Id,
            type: model.Type,
            data: model
        })

        try {
            this._hook({ id: model.Properties.Id, type: model.Type, data: model }, packageName)
        } catch (e) {}
    }

    private _parsePins(model: any) {
        let inputPins = model.Properties.InputPins
        let outputPins = model.Properties.OutputPins

        for (let pin of inputPins) {
            this._parsePin(pin)
        }
        for (let pin of outputPins) {
            this._parsePin(pin)
        }
    }

    private _parsePin(model: any) {
        this._pins.push({
            id: model.Id,
            owner: model.Owner,
            targetPin: model.Connections ? model.Connections[0].TargetPin : undefined
        })
    }

    private _resolvePin(id: string): string {
        let pin = this._pins.find(pin => pin.id == id)
        if (pin == undefined) {
            return ""
        }
        return pin.targetPin ? this._resolvePin(pin.targetPin) : pin.owner
    }

    private _parseJump(model: any, packageName: string): IJump {
        const properties = model.Properties
        const id = properties.Id
        const target = this._resolvePin(properties.TargetPin)

        const jump: IJump = {
            id: id,
            destination: target
        }

        try {
            this._hook({ id: id, type: "Jump", data: jump }, packageName)
        } catch (e) {}

        return jump
    }

    private _parseCondition(model: any, packageName: string): ICondition {
        const properties = model.Properties
        const id = properties.Id
        const technicalName = properties.TechnicalName
        const parent = properties.Parent
        const expression = properties.Expression.replaceAll("\n", " ") // "billy.prologuea1s1a_open == true\n"

        const trueTarget = this._resolvePin(properties.OutputPins[0].Connections[0].TargetPin)
        let falseTarget = ""
        try {
            falseTarget = this._resolvePin(properties.OutputPins[1].Connections[0].TargetPin)
        } catch (e) {}

        const condition: ICondition = {
            id: id,
            technicalName: technicalName,
            parentSequence: parent,
            expression: expression,
            trueFrame: trueTarget,
            falseFrame: falseTarget
        }

        try {
            this._hook({ id: id, type: "Condition", data: condition }, packageName)
        } catch (e) {}

        return condition
    }

    private _parseExpressionPart(expression: string): IVariable | boolean | number {
        let value: IVariable | boolean | number = 0
        let isValueParsed = false

        if (expression == "true" || expression == "false") {
            value = expression == "true"
            isValueParsed = true
        } else if (!isNaN(Number(expression))) {
            value = Number(expression)
            isValueParsed = true
        }

        if (!isValueParsed) {
            const expressionParts = expression.split(".")
            const variableNamespace = expressionParts[0]
            const variableName = expressionParts[1]

            try {
                const variableNamespaceObject = this._parsedData.variables.find(val => val.namespace === variableNamespace)
                const variableObject = variableNamespaceObject?.variables.find(val => val.name === variableName)

                if (variableObject) {
                    value = variableObject
                }
            } catch (e) {
                // console.log(variableName);
            }
        }

        return value
    }

    private _parseDialogue(model: any, packageName: string): ISequence {
        const properties = model.Properties
        const template = model.Template

        const id = properties.Id
        const technicalName = properties.TechnicalName
        const displayName = _localizations[properties.DisplayName]

        const backgroundId = properties.PreviewImage.Asset
        const background = _imageAssets.find(a => a.id === backgroundId)

        const themeSong =
            template.environment.themeSong == "0x0000000000000000"
                ? undefined
                : _audioAssets.find(a => a.id === template.environment.themeSong)

        const inputPins = properties.InputPins
        const firstFrame = inputPins[0].Connections[0].Target

        const outputPins = properties.OutputPins
        let target = ""
        if ("Connections" in outputPins[0]) {
            const connections = outputPins[0].Connections
            if (connections) {
                target = this._resolvePin(connections[0].TargetPin)
            } else {
                // console.log("No target sequence found for sequence " + id);
            }
        } else {
            // console.log("No target sequence found for sequence " + id);
        }

        const sequence: ISequence = {
            id: id,
            technicalName: technicalName,
            displayName: displayName,
            targetSequence: target,
            frames: [],
            conditions: [],
            themeSong: themeSong,
            themeBackground: background,
            chapter: packageName,
            firstFrame: firstFrame
        }
        //// console.log("Add Sequence " + sequence.id)

        try {
            this._hook({ id: id, type: "Dialogue", data: sequence }, packageName)
        } catch (e) {}

        return sequence
    }

    private _parseDialogueFragmentTemplate(model: any, packageName: string): IFrame {
        const properties = model.Properties
        const template = model.Template
        const node = template.node

        let id = properties.Id
        if (!id) id = ""
        const technicalName = properties.TechnicalName
        const parent = properties.Parent
        const text = _localizations[properties.Text]
        const speaker = properties.Speaker
        const menuText = properties.MenuText

        const inputPin = properties.InputPins[0]
        const inputCondition = inputPin.Text

        const outputPins = properties.OutputPins
        let connections = []
        if ("Connections" in outputPins[0]) {
            connections = outputPins[0].Connections
        }
        const actionExpression: string = outputPins[0].Text.replaceAll("\n", " ")

        let buttons: IButton[] = []
        for (let connection of connections) {
            const button: IButton = {
                text: connection.Label,
                targetFrame: this._resolvePin(connection.TargetPin)
            }
            buttons.push(button)
        }

        if (buttons[0]) {
            // if (buttons[0].targetFrame == parent) {
            //     buttons[0].targetFrame = "END";
            // }
        } else {
            buttons = [{ text: "Next", targetFrame: "" }]
        }

        let characters = []

        for (let i = 1; i <= 11; i++) {
            if (template["characterInFrame_0" + i] != undefined) {
                const character = this._parseFrameCharacter(template["characterInFrame_0" + i])
                if (character != null) {
                    characters.push(character)
                }
            }
        }

        const typeNode: NodeType = node.typeNode as NodeType
        const autoScrollingTimer = node.autoScrollingTimer == null ? undefined : node.autoScrollingTimer
        const soundEffect = node.soundEffect == "0x0000000000000000" ? undefined : _audioAssets.find(a => a.id === node.soundEffect)
        const sceneOverlay = node.sceneOverlay == "0x0000000000000000" ? undefined : _imageAssets.find(a => a.id === node.sceneOverlay)
        const sceneBackground = this._parsedData.sequences.find(s => s.id === parent)?.themeBackground
        const bubbleSpeech = node.bubbleSpeech as BubbleSpeech
        let title = undefined
        if (node.title) {
            if (node.title.length > 0) {
                title = node.title
            }
        }

        const speedSpeech = node.speedSpeech
        const shakeCameraIntensity = node.shakeCameraIntensity
        const moveCamera = node.moveCamera
        const hpButtonName = node.hpButtonName
        const showHpButton = node.showHpButton

        const frame: IFrame = {
            id: id,
            technicalName: technicalName,
            parentSequence: parent,
            text: text,
            menuText: menuText,
            speaker: speaker,
            buttons: buttons,
            characters: characters,
            parameters: {
                typeNode: typeNode,
                autoScrollingTimer: autoScrollingTimer,
                soundEffect: soundEffect,
                sceneOverlay: sceneOverlay,
                sceneBackground: sceneBackground,
                bubbleSpeech: bubbleSpeech,
                speedSpeech: speedSpeech,
                shakeCameraIntensity: shakeCameraIntensity,
                moveCamera: moveCamera,
                hpButtonName: hpButtonName,
                showHpButton: showHpButton,
                title: title
            },
            action: actionExpression.length > 0 ? actionExpression : undefined,
            inputCondition: inputCondition.length > 0 ? inputCondition : undefined
        }

        try {
            this._hook({ id: id, type: "DialogueFragment", data: frame }, packageName)
        } catch (e) {}

        return frame
    }

    private _parseFrameCharacter(model: any): IFrameCharacter | null {
        const name = model.name
        if (name == "12") {
            return null
        }
        return {
            characterShortId: parseInt(model.name),
            animations: _animationsAllCharacters[parseInt(model.animations)],
            directionOfView: parseInt(model.directionOfView),
            position: model.position
        }
    }
    private _parseEntity(model: any, packageName: string): ICharacter {
        const properties = model.Properties

        const id = properties.Id
        const technicalName = properties.TechnicalName
        const displayNameOriginal = _localizations[properties.DisplayName].split("_")

        const number = parseInt(displayNameOriginal[0])
        const displayNameActual = displayNameOriginal[1]

        const asset = properties.PreviewImage.Asset

        const template = model.Template
        const textSound = template.cueSound.textSound

        const textSoundAsset = _audioAssets.find(a => a.id === textSound)

        const character: ICharacter = {
            id: id,
            technicalName: technicalName,
            shortId: number,
            displayName: displayNameActual,
            asset: asset,
            textSound: textSoundAsset
        }

        try {
            this._hook({ id: id, type: "Entity", data: character }, packageName)
        } catch (e) {}

        return character
    }

    private _parseAudioAsset(model: any, packageName: string): IAudioAsset {
        const properties = model.Properties

        const id = properties.Id
        const technicalName = properties.TechnicalName
        const displayName = properties.DisplayName
        const filePath = model.AssetRef

        const audioAsset: IAudioAsset = {
            id: id,
            technicalName: technicalName,
            displayName: displayName,
            filePath: filePath
        }

        try {
            this._hook({ id: id, type: "AudioAsset", data: audioAsset }, packageName)
        } catch (e) {}

        return audioAsset
    }

    private _parseImageAsset(model: any, packageName: string): IImageAsset {
        const properties = model.Properties

        const id = properties.Id
        const technicalName = properties.TechnicalName
        const displayName = properties.DisplayName
        const filePath = model.AssetRef

        const imageAsset: IImageAsset = {
            id: id,
            technicalName: technicalName,
            displayName: displayName,
            filePath: filePath
        }

        try {
            this._hook({ id: id, type: "ImageAsset", data: imageAsset }, packageName)
        } catch (e) {}

        return imageAsset
    }
}
