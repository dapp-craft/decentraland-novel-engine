import Parser from "./parser/parser"
import CharacterController from "./scene/character/character-controller"
import SceneController from "./scene/scene-controller"
import Frame from "./sequence/frame"
import Sequence from "./sequence/sequence"
import UIController from "./ui/ui-controller"
import ICondition from "./parser/interface/i-condition"
import IVariable from "./parser/interface/i-variable"
import ICharacter from "./parser/interface/i-character"
import IAudioAsset from "./parser/interface/assets/i-audio"
import { Entity, executeTask } from "@dcl/sdk/ecs"
import { Vector3 } from "@dcl/sdk/math"
import IManifest from "./parser/interface/i-manifest"
import ManifestParser from "./parser/manifest-parser"
import Utf8ArrayToStr from "./parser/file-reader"
import { readFile } from "~system/Runtime"
import IUnknownNode from "./parser/interface/i-unknown-node"
import IHookNode from "./parser/interface/i-hook-node"
import { soundController } from "./util/sound-controller"
import { NovelController } from "./util/novel-controller"
import { ICharacterTemplate } from "./scene/character/character-properties"
import { IButtonTemplate } from "./ui/button/renderedButton"

export let currentFrameId: string = "No active frame"

export default class Engine {
    public _currentFrame: Frame | undefined = undefined
    public onSequencesInitialized: ((sequences: Sequence[]) => void)[] = []
    public onFrameLoaded: ((frame: Frame) => {})[] = []
    private _prevFrame: string | undefined

    private _manifest: IManifest | undefined
    private _sequences: Sequence[] = []

    private _resolveReady: Function = () => {}
    private _ready = new Promise(r => (this._resolveReady = r))

    public _unknownNodes: IUnknownNode[] = []

    public readonly characterController: CharacterController

    public _variables: { [key: string]: IVariable } = {}

    // novel controllers is a dictionary of string - NovelController items
    public novelControllers: { [key: string]: NovelController }

    public characterTemplates: ICharacterTemplate[]

    // Theme sound handling
    private _currentSound: IAudioAsset | undefined = undefined
    private _currentSoundEntity: Entity | undefined = undefined

    private _preLoadFrameHookArray: ((previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => boolean)[] = []
    private _postLoadFrameHookArray: ((previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => void)[] = []
    private _onNodeParsedHookArray: ((node: IHookNode, packageId: string) => void)[] = []

    private _prevObject: IHookNode | undefined = undefined

    private _loadedPackages: string[] = []

    public getUiController() {
        return this.novelControllers["uiController"] as UIController
    }
    public getSceneController() {
        return this.novelControllers["sceneController"] as SceneController
    }

    constructor(
        manifestFilePath: string,
        characterTemplates: ICharacterTemplate[],
        buttonTemplates: IButtonTemplate[],

        customControllers?: { [key: string]: NovelController }
    ) {
        engineInstance = this

        this.characterTemplates = characterTemplates

        // console.log("Starting engine...");

        console.log("Parsing manifest...")
        executeTask(async () => {
            let manifestFile = await readFile({ fileName: manifestFilePath })
            let manifestJson = JSON.parse(Utf8ArrayToStr(manifestFile.content))

            this._manifest = new ManifestParser().parse(manifestJson)
            this._resolveReady()

            console.log("Manifest parsed")
            // console.log(this._manifest)
        })

        this.novelControllers = customControllers ?? {}
        this.novelControllers["uiController"] = new UIController(buttonTemplates)
        this.novelControllers["sceneController"] = new SceneController()
        this.characterController = new CharacterController(characterTemplates)
        // this._parser = new Parser(inputJson);
        // // console.log("STARTING PARSER")
        // const parsedData = this._parser.parse();
        // // console.log("PARSED DATA")
        // // console.log(parsedData)

        // this._sequences = []
        //     = parsedData.sequences.map(
        //         s => new Sequence(
        //             s.frames.map(f => new Frame(
        //                 f.id,
        //                 f.technicalName,
        //                 f.parentSequence,
        //                 f.text,
        //                 f.speaker,
        //                 f.characters,
        //                 f.buttons.map(b => new FrameButton(
        //                     b.text,
        //                     b.targetFrame,
        //                     buttonConfig.get(b.text)
        //                 )),
        //                 f.parameters,
        //                 f.action,
        //                 f.inputCondition,
        //                 f.menuText
        //             )),
        //             s.id,
        //             s.technicalName,
        //             s.displayName,
        //             s.targetSequence,
        //             s.conditions,
        //             s.ideas,
        //             s.themeSong,
        //             s.themeBackground,
        //             s.chapter,
        //             s.firstFrame
        //         )
        //     )
        // for (let namespace of parsedData.variables) {
        //     const namespaceId = namespace.namespace;
        //     for (let variable of namespace.variables) {
        //         const variableId = variable.name;

        //         const name = namespaceId + "." + variableId;
        //         this._variables[name] = variable;
        //     }
        // }

        // this._ideas = parsedData.ideas;
        //  this.showFirstFrame();
    }

    public getPrevousFrame() {
        return this._prevFrame
    }
    public addPreLoadFrameHook(hook: (previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => boolean) {
        this._preLoadFrameHookArray.push(hook)
    }

    public addPostLoadFrameHook(hook: (previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => void) {
        this._postLoadFrameHookArray.push(hook)
    }

    public addOnNodeParsedHook(hook: (node: IHookNode, packageId: string) => void) {
        this._onNodeParsedHookArray.push(hook)
    }

    public async addPackage(packageName: string) {
        await this._ready

        if (this._loadedPackages.includes(packageName)) {
            console.log(`Package '${packageName}' already loaded, skipping.`)
            return
        }
        let packageToAdd = this._manifest!.packages.find(p => p.name === packageName)
        if (!packageToAdd) {
            console.error(`Package '${packageName}' not found in manifest.`)
            return
        }

        console.log(`Loading package '${packageName}'...`)
        let globalVariablesFile = await readFile({ fileName: "src/input/" + this._manifest!.globalVariablesFileName })
        let objectDefinitionsTypesFile = await readFile({ fileName: "src/input/" + this._manifest!.objectDefinitionsTypesFileName })
        let objectDefinitionsTextsFile = await readFile({ fileName: "src/input/" + this._manifest!.objectDefinitionsTextsFileName })
        let packageLocalizationsFile = await readFile({ fileName: "src/input/" + packageToAdd.localizationsFileName })
        let packageObjectsFile = await readFile({ fileName: "src/input/" + packageToAdd.objectsFileName })

        let globalVariablesJson = JSON.parse(Utf8ArrayToStr(globalVariablesFile.content))
        let objectDefinitionsTypesJson = JSON.parse(Utf8ArrayToStr(objectDefinitionsTypesFile.content))
        let objectDefinitionsTextsJson = JSON.parse(Utf8ArrayToStr(objectDefinitionsTextsFile.content))
        let packageLocalizationsJson = JSON.parse(Utf8ArrayToStr(packageLocalizationsFile.content))
        let packageObjectsJson = JSON.parse(Utf8ArrayToStr(packageObjectsFile.content))

        let parser = new Parser(
            globalVariablesJson,
            objectDefinitionsTypesJson,
            objectDefinitionsTextsJson,
            packageObjectsJson,
            packageLocalizationsJson,
            this._manifest!.packages.indexOf(packageToAdd) + 1,
            (node: IHookNode, packageId: string) => {
                this._onNodeParsedHookArray.forEach(hook => hook(node, packageId))
            }
        )
        let parsedData = parser.parse(packageName)

        // console.log("PARSED DATA")
        // console.log(parsedData)

        // upsert new values
        for (let namespace of parsedData.variables) {
            const namespaceId = namespace.namespace
            for (let variable of namespace.variables) {
                const variableId = variable.name

                const name = namespaceId + "." + variableId
                this._variables[name] = variable
            }
        }

        for (let sequence of parsedData.sequences) {
            if (this._sequences.find(s => s.id === sequence.id)) {
                // console.log("Sequence " + sequence.id + " already exists, skipping.")
                continue
            }
            // add new sequence
            this._sequences.push(
                new Sequence(
                    sequence.frames.map(
                        f =>
                            new Frame(
                                f.id,
                                f.technicalName,
                                f.parentSequence,
                                f.text,
                                f.speaker,
                                f.characters,
                                f.buttons, //markable, ui, hotkey
                                f.parameters,
                                f.action,
                                f.inputCondition,
                                f.menuText
                            )
                    ),
                    sequence.id,
                    sequence.technicalName,
                    sequence.displayName,
                    sequence.targetSequence,
                    sequence.conditions,
                    sequence.themeSong,
                    sequence.themeBackground,
                    packageName,
                    sequence.firstFrame
                )
            )
        }

        for (let key in this.novelControllers) {
            this.novelControllers[key].setSequences(this._sequences)
        }

        for (let i = 0; i < this.onSequencesInitialized.length; i++) {
            this.onSequencesInitialized[i](this._sequences)
        }
        this.characterController.addCharacters(parsedData.characters)

        for (let unknownNode of parsedData.unknownNodes) {
            if (this._unknownNodes.find(u => u.id === unknownNode.id)) {
                // console.log("Unknown node " + unknownNode.id + " already exists, skipping.")
                continue
            }
            this._unknownNodes.push(unknownNode)
        }

        // console.log("updatedData")
        // console.log(this._sequences)

        //upsert chapter connectors
        console.log("parsedData")
        console.log(parsedData)

        this._loadedPackages.push(packageName)
    }

    public isPackageLoaded(packageName: string): boolean {
        return this._loadedPackages.includes(packageName)
    }

    public getFirstSequenceOfPackage(packageName: string): Sequence | undefined {
        let sequence = this._sequences.find(s => s.chapter == packageName)
        return sequence
    }

    public getFrameById(id: string): Frame | undefined {
        for (let sequence of this._sequences) {
            let frame = sequence.frames.find(f => f.id === id)
            if (frame) {
                return frame
            }
        }
        // console.log("Frame " + id + " not found.");
        return undefined
    }

    public getSequenceById(id: string): Sequence | undefined {
        return this._sequences.find(s => s.id === id)
    }

    public showFirstFrame() {
        // console.log("SHOW FIRST FRAME")
        // console.log(this._sequences[0].firstFrame)

        // // console.log("0x0100000000004AF1");
        this.showFrame(this._sequences[0].firstFrame)
        // this.showFrame("0x010000000000FF1D");
    }

    private _seqId = 1
    public showLastSequenceFrame() {
        this.showFrame(this._sequences[this._sequences.length - 1].frames[this._sequences[this._sequences.length - 1].frames.length - 1].id)
    }

    public getCharacterById(id: string): ICharacter | undefined {
        return this.characterController.getCharacters().find(c => c.charData.id === id)?.charData
    }

    findSpeaker(id: string) {
        let speaker = this.characterController.getCharacters().find(c => c.charData.id === id)
        if (speaker) {
            // replace first letter on UpperCase

            return speaker.charData.displayName.charAt(0).toUpperCase() + speaker.charData.displayName.slice(1)
        }
        return ""
    }

    private testInt = 0
    async showFrame(id: string, performPreviousAction: boolean = true) {
        this._prevFrame = this._currentFrame?.id
        try {
            if (performPreviousAction && this._currentFrame) {
                if (this._currentFrame.action) {
                    // console.log("Performing action " + this._currentFrame.action);
                    this._evaluateAction(this._currentFrame.action)
                    this._currentFrame = undefined
                }
            }
        } catch (e) {
            // console.log("Error performing previous action: " + e);
        }

        let currentFrameIdCopy = currentFrameId

        try {
            let frame
            let condition
            let sequenceFound
            let object = undefined
            let type = undefined
            for (let sequence of this._sequences) {
                frame = sequence.frames.find(f => f.id === id)
                if (frame) {
                    object = frame
                    type = "nodeTemplateFrame"
                    break
                }
                condition = sequence.conditions.find(c => c.id === id)
                if (condition) {
                    object = condition
                    type = "Condition"
                    break
                }
                if (sequence.id == id) {
                    sequenceFound = sequence
                    object = condition
                    type = "Sequence"
                    break
                }
            }

            let newNodeObject: IHookNode = {
                id: id,
                type: type ? type : "unknown",
                data: object
            }

            if (object == undefined) {
                object = this._unknownNodes.find(node => node.id == id)
                if (object != undefined) {
                    newNodeObject.type = object.type
                    newNodeObject.data = object.data
                }
            }

            let allTrue = true

            this._preLoadFrameHookArray.forEach(hook => {
                if (!hook(this._prevObject, newNodeObject)) {
                    allTrue = false
                }
            })

            if (!allTrue) {
                return
            }

            if (frame) {
                // // console.log("Loading frame " + frame.id);

                // // console.log(this.getUnlockedIdeas(frame.parentSequence))

                let buttons = []

                try {
                    for (let button of frame.buttons) {
                        let targetFrame = button.targetFrame
                        let localFrame
                        for (let sequence of this._sequences) {
                            localFrame = sequence.frames.find(f => f.id === targetFrame)
                            if (localFrame) {
                                break
                            }
                        }
                        if (!localFrame) {
                            // console.log("Frame " + targetFrame + " not found.");
                            buttons.push(button)
                        } else {
                            if (localFrame.inputCondition != undefined) {
                                // console.log(localFrame.inputCondition)
                                if (this._evaluateInput(localFrame.inputCondition)) {
                                    buttons.push(button)
                                }
                            } else {
                                buttons.push(button)
                            }
                        }
                    }
                } catch (error) {
                    // console.log(error);
                    buttons = frame.buttons
                }
                // console.log("buttons")
                // console.log(buttons);

                // if (frame.menuText == "Challenge") {
                //     buttons.push(new FrameButton("idea-background", frame.id))
                // }

                let constructedFrame = new Frame(
                    frame.id,
                    frame.technicalName,
                    frame.parentSequence,
                    frame.text,
                    frame.speaker,
                    frame.characters,
                    buttons,
                    frame.parameters,
                    frame.action,
                    frame.inputCondition,
                    frame.menuText
                )
                // // console.log(constructedFrame)

                this.testInt++
                for (let key in this.novelControllers) {
                    this.novelControllers[key].onPreLoadFrame(constructedFrame)
                }

                this.onFrameLoaded.forEach(v => v(constructedFrame))
                // Theme sound handling
                let parentSequence = this._sequences.find(s => s.id === constructedFrame.parentSequence)
                if (parentSequence) {
                    let parentSequenceSound = parentSequence.themeSong
                    if (parentSequenceSound) {
                        if (this._currentSound) {
                            if (this._currentSound.id !== parentSequenceSound.id) {
                                if (this._currentSoundEntity) {
                                    soundController.stopMusicSound(this._currentSoundEntity)
                                    //  engine.removeEntity(this._currentSoundEntity);
                                    this._currentSoundEntity = undefined
                                }
                                this._currentSound = parentSequenceSound
                                //    this._currentSoundEntity = utils.playSound(parentSequenceSound.filePath, true, Vector3.create(0, 11.6, 0));
                                this._currentSoundEntity = soundController.playMusicSound(
                                    parentSequenceSound.filePath,
                                    true,
                                    Vector3.create(0, 11.6, 0)
                                )
                            }
                        } else {
                            this._currentSound = parentSequenceSound
                            //  this._currentSoundEntity = utils.playSound(parentSequenceSound.filePath, true, Vector3.create(0, 11.6, 0));
                            this._currentSoundEntity = soundController.playMusicSound(
                                parentSequenceSound.filePath,
                                true,
                                Vector3.create(0, 11.6, 0)
                            )
                        }
                    } else {
                        if (this._currentSound) {
                            if (this._currentSoundEntity) {
                                //  engine.removeEntity(this._currentSoundEntity);
                                soundController.stopMusicSound(this._currentSoundEntity)
                                this._currentSoundEntity = undefined
                            }
                            this._currentSound = undefined
                        }
                    }
                }

                this._currentFrame = constructedFrame
                currentFrameId = constructedFrame.id
                for (let key in this.novelControllers) {
                    this.novelControllers[key].onPostLoadFrame(constructedFrame)
                }
            } else if (condition) {
                // console.log("Evaluting condition " + condition.id);
                this.showFrame(this._evaluateCondition(condition))
            } else if (sequenceFound) {
                // console.log("Found sequence, jumping to the first frame")
                this.showFrame(sequenceFound.firstFrame)
                this._seqId = 0
            } else {
                // console.log("Frame or condition or sequence " + id + " not found.")
            }

            this._postLoadFrameHookArray.forEach(hook => hook(this._prevObject, newNodeObject))
            this._prevObject = newNodeObject
        } catch (e) {
            // console.log("Error showing frame " + id + ": " + e);
        }
    }

    public _evaluateInput(inputCondition: string): boolean {
        // console.log(this._variables);

        let expression = inputCondition
        while (expression.includes("\n")) {
            expression = expression.replace("\n", " ")
        }
        // console.log("eval: " + expression);
        let expressionTokens = expression.split(" ")
        for (let expressionToken of expressionTokens) {
            if (this._variables[expressionToken]) {
                expression = expression.replace(expressionToken, this._variables[expressionToken].value.toString())
            }
        }
        // console.log(expression)
        // console.log("eval: " + expression);
        const result = eval(expression)

        return result
    }

    private _evaluateCondition(condition: ICondition): string {
        let expression = condition.expression
        let expressionTokens = expression.split(" ")
        for (let expressionToken of expressionTokens) {
            if (this._variables[expressionToken]) {
                expression = expression.replace(expressionToken, this._variables[expressionToken].value.toString())
            }
        }

        const result = eval(expression)

        return result ? condition.trueFrame : condition.falseFrame
    }

    private _evaluateAction(action: string) {
        let expression = action
        let expressionTokens = expression.split(" ")
        for (let expressionToken of expressionTokens) {
            if (this._variables[expressionToken]) {
                expression = expression.replace(expressionToken, 'this._variables["' + expressionToken + '"].value')
            }
        }

        // console.log("Evaluating action " + expression);

        eval(expression)

        //// console.log(this._variables);
    }

    public getSequences(): Sequence[] {
        return this._sequences
    }

    public getVariable(name: string): IVariable | undefined {
        return this._variables[name]
    }
}

export let engineInstance: Engine
