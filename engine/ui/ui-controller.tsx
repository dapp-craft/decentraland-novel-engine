import { timers } from "@dcl-sdk/utils"
import Frame from "../sequence/frame"
import Button from "./button/button"
import ReactEcs, { UiEntity } from "@dcl/sdk/react-ecs"
import { engineInstance } from "../engine"
import NodeType from "../parser/enum/enum-type-node"
import BubbleSpeech, { bubbleByEnum, getAllBubbleFiles } from "../parser/enum/enum-bubble-speech"
import { canvasWidth } from "./canvasConstants"
import Sequence from "../sequence/sequence"
import UiStatickMethods from "./ui-static-methods"
import UiStaticMethods from "./ui-static-methods"
import { OverlayController } from "./overlay-controller"
import { settings } from "./settings"
import { palette } from "./palette"
import { Vector3 } from "@dcl/sdk/math"
import { soundController } from "../util/sound-controller"
import { NovelController } from "../util/novel-controller"
import { ButtonConfig } from "./button/buttonConfig"
import { IButtonTemplate } from "./button/renderedButton"

interface MarkedFrame {
    frame: string
    buttonNames: string[]
}
interface MarkedButton {
    text: string
    isMarked: boolean
}
export default class UIController extends NovelController {
    public visible: boolean = true
    public overlayController: OverlayController
    public stopTextAnimation = false
    public blockInput = false

    public markedFrames: MarkedFrame[] = []
    public buttonConfig: ButtonConfig

    private _fontSize = 20
    private npcText: { value: string } = { value: "" }
    private _nextButton: Button = new Button()
    private targetBubble = ""
    private currentFrameData: Frame = new Frame(
        "debug frame id",
        "debug name",
        "",
        "debug speaker",
        "",
        [],
        [{ text: "Test Button", targetFrame: "2" }],
        {
            typeNode: NodeType.Dialog,
            autoScrollingTimer: undefined,
            sceneOverlay: undefined,
            soundEffect: undefined,
            sceneBackground: undefined,
            bubbleSpeech: BubbleSpeech.None,
            speedSpeech: 1,
            shakeCameraIntensity: 0,
            moveCamera: 0,
            hpButtonName: "a",
            showHpButton: false,
            title: undefined
        },
        undefined,
        undefined,
        undefined
    )
    private showColorEnd = false
    private currentMarkedButtons: MarkedButton[] = []

    get nextButton(): Button {
        return this._nextButton
    }
    constructor(buttonTemplates: IButtonTemplate[]) {
        super()
        this.buttonConfig = new ButtonConfig(buttonTemplates)
        this.overlayController = new OverlayController()
    }

    public setSequences(sequences: Sequence[]) {
        this.overlayController.setSequences(sequences)
    }

    public onPreLoadFrame(frame: Frame): void {}
    public onPostLoadFrame(frame: Frame): void {
        if (frame.parameters.typeNode == NodeType.Service) return
        this.overlayController.setOverlay(frame)

        timers.setTimeout(() => {
            this.targetBubble = bubbleByEnum(this.currentFrameData.parameters.bubbleSpeech)
        }, 100)

        if (frame.parameters.typeNode == NodeType.Cutscene && frame.parameters.sceneOverlay) {
            this.loadOverlayNode(frame)
            return
        }

        this.loadDialogNode(frame)

        if (frame.parameters.typeNode == NodeType.Cutscene) {
            this.buttonConfig.refresh()
            let delay = (frame.parameters.autoScrollingTimer ?? 0.1) * 1000
            timers.setTimeout(() => {
                engineInstance.showFrame(frame.buttons[0].targetFrame)
            }, delay)
        }
    }

    public isMarked(text: string): boolean {
        let b = this.currentMarkedButtons.find(f => f.text == text)
        if (b) return b.isMarked
        return false
    }
    public forgetAllMarkables() {
        for (let i = 0; i < this.markedFrames.length; i++) {
            this.markedFrames[i].buttonNames = []
        }
    }
    public rememberButtonMark(text: string) {
        if (text == "" || text == "Next") return

        for (let i = 0; i < this.markedFrames.length; i++) {
            if (this.markedFrames[i].frame == this.currentFrameData.id) {
                for (let j = 0; j < this.markedFrames[i].buttonNames.length; j++) {
                    if (this.markedFrames[i].buttonNames[j] == text) {
                        return
                    }
                }
                this.markedFrames[i].buttonNames.push(text)
            }
        }
    }

    private addAndRemember() {
        // add to marked
        // add to remember
        this.currentMarkedButtons = []
        if (this.currentFrameData.buttons.length > 1) {
            let f = this.markedFrames.find(f => f.frame == this.currentFrameData.id)
            this.currentMarkedButtons = []
            for (let i = 0; i < this.currentFrameData.buttons.length; i++) {
                if (f) {
                    this.currentMarkedButtons.push({
                        text: this.currentFrameData.buttons[i].text,
                        isMarked: f.buttonNames.find(f => f == this.currentFrameData.buttons[i].text) ? true : false
                    })
                } else {
                    this.markedFrames.push({
                        frame: this.currentFrameData.id,
                        buttonNames: []
                    })
                }
            }
        }
    }
    private loadDialogNode(frame: Frame) {
        this.currentFrameData = frame

        this.buttonConfig.refresh()

        this.currentFrameData.buttons.forEach(e => {
            this.buttonConfig.changeButton(e)
        })
        this.addAndRemember()

        if (settings.properties.textSpeed < 1.41) {
            this.stopTextAnimation = false

            timers.setTimeout(() => {
                this.updateTextByAnimation(this.npcText, this.currentFrameData.text, 40, () => {
                    let speaker = engineInstance.characterController.getCharacter(
                        engineInstance.characterController.getShortId(this.currentFrameData.speaker)
                    )

                    let frameChar = this.currentFrameData.characters.find(c => c.characterShortId == speaker?.charData.shortId)
                    if (frameChar) {
                        speaker.SetAnimation(
                            frameChar.animations,

                            false
                        )
                    }
                })
            }, 20)
        } else {
            this.stopTextAnimation = true
            this.npcText.value = UiStatickMethods.removeSpecificSymbols(this.currentFrameData.text)
        }
    }

    private loadOverlayNode(frame: Frame) {
        this.overlayController.loadCutScene(frame)
    }

    private updateTextByAnimation(
        text: { value: string },
        finalText: string,
        speed: number = 20,
        callback: () => void = () => {},
        step: number = 0
    ) {
        if (!finalText) {
            callback()
            return
        }
        if (step - 1 == finalText.length || this.stopTextAnimation) {
            text.value = UiStatickMethods.removeSpecificSymbols(finalText)

            this.stopTextAnimation = true

            callback()

            return
        }

        text.value = ""

        let txt = finalText.substring(0, step)

        if (this.showColorEnd) txt += "</color>"
        for (let i = 0; i < txt.length; i++) {
            if (txt[i] == "^") continue
            text.value += txt[i]
        }

        if (finalText.length > step + 2 && finalText[step + 1] == "<") {
            if (finalText[step + 2] == "/") {
                step += 9
                this.showColorEnd = false
            } // <color
            else {
                this.showColorEnd = true
                step += 16
            }
        }

        let speakerFound = this.currentFrameData.speaker
        let characterFound = engineInstance.getCharacterById(speakerFound)
        if (characterFound) {
            if (characterFound.textSound) {
                if (finalText[step] != "^" && finalText[step] != " " && finalText[step] != "\n" && step % 1 == 0) {
                    //playSound(characterFound.textSound.filePath, false, Vector3.create(0, 35, 0));
                    soundController.playSpeechSound(characterFound.textSound.filePath, Vector3.create(0, 11, 0))
                }
            }
        }
        // if(finalText[step] != '^')

        timers.setTimeout(() => {
            this.updateTextByAnimation(text, finalText, speed, callback, step + 1)
        }, speed / settings.properties.textSpeed)
    }

    public dialogWithOverlays() {
        return (
            <UiEntity
                uiTransform={{
                    width: "100%",
                    height: "100%",
                    positionType: "absolute"
                }}
            >
                {this.overlayController.cutSceneFrame()}
                {this.dialogFrame()}
            </UiEntity>
        )
    }
    private dialogFrame() {
        return getAllBubbleFiles().map(bubbleFile => {
            return (
                <UiEntity
                    key={"bubble_" + bubbleFile}
                    uiTransform={{
                        width: "100%",
                        height: "40%",
                        position: {
                            bottom: "-10%"
                        },
                        positionType: "absolute",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        display: this.visible && this.targetBubble == bubbleFile ? "flex" : "none",
                        // display: this.visible ? "flex" : "none",
                        pointerFilter: "block"
                    }}
                >
                    <UiEntity // background
                        key={"bubble_background"}
                        uiTransform={{
                            width: canvasWidth * 0.95,
                            height: canvasWidth * 0.95 * 0.14, // 0.15625
                            positionType: "absolute",
                            flexDirection: "column"
                        }}
                        uiBackground={{
                            textureMode: "stretch",
                            texture: {
                                src: bubbleFile
                            }
                        }}
                    >
                        <UiEntity // npc name positioning
                            key={"bubble_npc_name"}
                            uiTransform={{
                                width: "20%",
                                height: "20%",
                                position: { top: bubbleFile == "images/bubbles/bubbleShout.png" ? "9%" : "4%", right: "28%" },

                                alignSelf: "center"
                            }}
                            // uiBackground={{
                            //     color: Color4.Green()

                            // }}
                            uiText={{
                                value: UiStaticMethods.getSpeakerName("", this.currentFrameData),
                                color: palette.frameTextColor,
                                fontSize: this._fontSize * canvasWidth * 0.0006 * 1.3,
                                font: "sans-serif",
                                textAlign: "middle-center"
                            }}
                        />

                        <UiEntity // buttons field
                            uiTransform={{
                                height: "90%",
                                width: "100%",
                                position: { bottom: 0 },
                                alignSelf: "flex-end",
                                flexDirection: "row",
                                justifyContent: "center",
                                flexWrap: "wrap",
                                alignItems: "center"
                            }}
                        >
                            <UiEntity // second text field
                                uiTransform={{
                                    width: "96%",
                                    height: "60%",
                                    position: { top: "12%", left: "3%" },
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    alignContent: "flex-start",
                                    positionType: "absolute"
                                }}
                                uiText={{
                                    value: UiStaticMethods.addNewLine(this.npcText.value, this._fontSize, 1100),
                                    color: palette.frameTextColor,
                                    fontSize: this._fontSize * canvasWidth * 0.0006,
                                    font: "monospace",
                                    textAlign: "top-left"
                                }}
                            />
                            {this.buttonsField()}
                        </UiEntity>
                    </UiEntity>
                </UiEntity>
            )
        })
    }

    private field() {}
    private buttonsField = () => (
        <UiEntity // left buttons field
            uiTransform={{
                width: "12%",
                height: "100%",
                positionType: "absolute"
            }}
        >
            {this.buttonConfig.renderedButtons.map((b, i) => b.render())}
        </UiEntity>
    )
}
