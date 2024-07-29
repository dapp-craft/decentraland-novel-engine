import { Tween } from "../addons/tween"
import ReactEcs, { UiEntity } from "@dcl/sdk/react-ecs"
import { canvasHeight, canvasWidth } from "./canvasConstants"
import { Color4 } from "@dcl/sdk/math"
import IImageAsset from "../parser/interface/assets/i-image"
import Sequence from "../sequence/sequence"
import Frame from "../sequence/frame"
import { engineInstance } from "../engine"
import { timers } from "@dcl-sdk/utils"
import { palette } from "./palette"
import { novelEngine } from "../../.."

export class OverlayController {
    public cutSceneTweenProps = {
        a: 0,
        a_back: 1,
        size: 1,
        visible: false,
        texture: "images/ui/UI_separate png/ARGUMENT.png",
        targetFrame: "",
        lockButtons: false
    }

    private _overlays: IImageAsset[] = []
    private cutSceneTweenStart = new Tween(this.cutSceneTweenProps)
    private cutSceneTweenEnd = new Tween(this.cutSceneTweenProps)

    constructor() {}

    public setSequences(sequences: Sequence[]) {
        this._overlays = []
        for (let sequence of sequences) {
            for (let frame of sequence.frames) {
                if (frame.parameters.sceneOverlay) {
                    let sceneOverlay = frame.parameters.sceneOverlay
                    let found = this._overlays.find(o => o.filePath == sceneOverlay.filePath)
                    if (!found) {
                        this._overlays.push(frame.parameters.sceneOverlay)
                        // console.log("Overlay added: " + sceneOverlay.filePath);
                    }
                }
            }
        }
    }

    public addSceneOverlay(sceneOverlay: IImageAsset) {
        if (!this._overlays.find(o => o.filePath === sceneOverlay.filePath)) {
            this._overlays.push(sceneOverlay)
        }
    }
    public showOverlay(fileName: string) {
        this.cutSceneTweenProps.texture = fileName
        this.cutSceneTweenProps.size = 1
        this.cutSceneTweenProps.lockButtons = true
        this.cutSceneTweenStart
            .to({ a: 1, a_back: 1, size: 1 }, 800)
            .onComplete(() => {
                this.cutSceneTweenProps.lockButtons = false
            })
            .start()
    }
    public hideOverlay() {
        this.cutSceneTweenStart
            .to({ a: 0, a_back: 0, size: 1 }, 800)
            .onComplete(() => {
                this.cutSceneTweenProps.visible = false
            })
            .start()
    }

    public setOverlay(frame: Frame) {
        if (frame.parameters.sceneOverlay?.filePath && !frame.parameters.autoScrollingTimer) {
            // console.log("SETTING OVERLAY")
            // show overlay on the full screen
            this.cutSceneTweenProps.visible = true

            if (this.cutSceneTweenProps.a < 0.99 || this.cutSceneTweenProps.texture != frame.parameters.sceneOverlay.filePath) {
                this.cutSceneTweenProps.lockButtons = true

                if (this.cutSceneTweenProps.texture != frame.parameters.sceneOverlay.filePath) {
                    this.cutSceneTweenStart
                        .to({ a: 0, a_back: 1, size: 1 }, 500)
                        .onComplete(() => {
                            this.showOverlay(frame.parameters.sceneOverlay?.filePath ?? "")
                        })
                        .start()
                } else {
                    this.showOverlay(frame.parameters.sceneOverlay?.filePath ?? "")
                }
            }
        } else {
            if (this.cutSceneTweenProps.a > 0.01) {
                this.cutSceneTweenProps.lockButtons = true
                this.cutSceneTweenStart.stop()
                this.cutSceneTweenEnd.stop()
                this.cutSceneTweenEnd
                    .to({ a: 0, size: 1 }, 800)
                    .start()
                    .onComplete(() => {
                        this.cutSceneTweenProps.visible = false
                        this.cutSceneTweenProps.lockButtons = false
                    })
            }
        }
    }
    public loadCutScene(frame: Frame) {
        //this.targetBubble = bubbleByEnum(this.currentFrameData.parameters.bubbleSpeech);
        // console.log("LOADING CUT SCENE")
        this.cutSceneTweenProps.targetFrame = frame.buttons[0].targetFrame

        this.cutSceneTweenProps.texture = frame.parameters.sceneOverlay?.filePath ?? "images/ui/UI_separate png/ARGUMENT.png"
        if (frame.parameters.autoScrollingTimer) {
            this.cutSceneTweenEnd.stop()
            this.cutSceneTweenProps.a_back = 0
            this.cutSceneTweenProps.a = 0
            this.cutSceneTweenProps.size = 0
            this.cutSceneTweenProps.visible = true
            this.cutSceneTweenProps.lockButtons = true
            this.cutSceneTweenStart
                .to({ a: 1, a_back: 0.2, size: 1 }, frame.parameters.autoScrollingTimer * 425)
                .onComplete(() => {
                    this.cutSceneTweenEnd.start(frame.parameters.autoScrollingTimer ?? 2 * 100)
                })
                .start(0)
            this.cutSceneTweenEnd.to({ a: 0, a_back: 0, size: 0 }, frame.parameters.autoScrollingTimer * 425).onComplete(() => {
                this.cutSceneTweenProps.visible = false
                this.cutSceneTweenProps.lockButtons = false
                engineInstance.showFrame(this.cutSceneTweenProps.targetFrame)
            })
        }
    }
    public cutSceneFrame() {
        return this._overlays.map(overlay => {
            return (
                <UiEntity // cut scene bar
                    key={"cut_scene_bar_" + overlay.filePath}
                    uiTransform={{
                        width: "100%",
                        height: "100%",
                        positionType: "absolute",

                        alignSelf: "center",
                        justifyContent: "center",
                        pointerFilter: "none",
                        // position: (this.cutSceneTweenProps.visible && (overlay.filePath == this.cutSceneTweenProps.texture)) ? {} : {top: "-10000%"},
                        display: this.cutSceneTweenProps.visible && overlay.filePath == this.cutSceneTweenProps.texture ? "flex" : "none"
                    }}
                    uiBackground={{
                        //color: Color4.Black()
                        // color: palette.overlayBackground
                        color: Color4.create(0.192, 0, 0.384, this.cutSceneTweenProps.a_back)
                        //  color:Color4.create(0.2, 0.2, 0.2, 1),
                        //  textureMode: 'stretch',
                        //  texture: {
                        //   src: "Assets/Images/realm_bg.png"
                        // }
                    }}
                >
                    <UiEntity
                        uiTransform={{
                            width: ((canvasHeight * 1920) / 1080) * this.cutSceneTweenProps.size,
                            height: canvasHeight * this.cutSceneTweenProps.size,
                            alignSelf: "center",
                            positionType: "absolute"
                        }}
                        uiBackground={{
                            textureMode: "stretch",
                            color: Color4.create(1, 1, 1, this.cutSceneTweenProps.a),
                            texture: {
                                src: overlay.filePath
                            }
                        }}
                    />
                </UiEntity>
            )
        })
    }
}
