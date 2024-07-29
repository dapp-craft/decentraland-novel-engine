import ReactEcs, { EntityPropTypes, UiEntity, UiLabelProps, UiTransformProps } from "@dcl/sdk/react-ecs"
import { timers } from "@dcl-sdk/utils"
import { canvasWidth } from "../canvasConstants"
import { settings } from "../settings"
import { InputAction } from "@dcl/sdk/ecs"
import { Tween } from "../../addons/tween"
import { soundController } from "../../util/sound-controller"
import { Color4, Vector3 } from "@dcl/sdk/math"
import { engineInstance } from "../../engine"

export interface IButtonTemplate {
    id: string
    markable: boolean
    ui?: (EntityPropTypes & { uiText?: UiLabelProps }) | null
    hotKey?: InputAction
}

let defaultTransform: UiTransformProps = {
    width: "500%",
    height: "500%",
    positionType: "absolute",
    position: { left: "0%", bottom: "0%" }
}

export class RenderedButton {
    public targetFrame = ""
    private enabled: boolean = true
    // tweeonProps = {s - number}
    private tweenProps = { s: 1 }
    private tween = new Tween(this.tweenProps)
    constructor(public readonly template: IButtonTemplate) {}

    public setActive(enabled: boolean) {
        this.enabled = enabled
    }
    private animationLock = false
    public buttonClick() {
        if (engineInstance.getUiController().blockInput) return

        if (engineInstance.getUiController().overlayController.cutSceneTweenProps.lockButtons) return
        if (this.animationLock) return

        if (engineInstance.getUiController().stopTextAnimation) {
            timers.setTimeout(() => {
                engineInstance.getUiController().rememberButtonMark(this.template.id)
                engineInstance.showFrame(this.targetFrame)
                this.animationLock = false
            }, 100)
            this.animationLock = true
        } else {
            engineInstance.getUiController().stopTextAnimation = true
        }
        this.tween
            .to({ s: 1.05 }, 100)
            .onComplete(() => {
                this.tween.to({ s: 1 }, 300).start()
            })
            .start()
        soundController.playSound("Assets/Audio/click.wav", false, Vector3.create(0, 2, 0))
        // playSound("Assets/Audio/click.wav", false, Vector3.subtract(getPlayerPosition(), Vector3.create(0, 2, 0)))
    }
    private findNumberOfPersentage(s: string): number {
        //s = "number%"
        let copy = s.slice()
        let result = copy.match(/\d+/g)
        if (result) {
            return parseInt(result[0])
        }
        return 1
    }

    public getTransform(uiTransformProps?: UiTransformProps): UiTransformProps {
        let lock = engineInstance.getUiController().overlayController.cutSceneTweenProps.lockButtons
        if (!uiTransformProps) {
            uiTransformProps = defaultTransform
        }

        if (this.tweenProps.s == 1) {
            return {
                width: uiTransformProps.width,
                height: uiTransformProps.height,
                positionType: uiTransformProps.positionType ?? "absolute",
                position: uiTransformProps.position ?? { left: "370%", bottom: "10%" },
                display: this.enabled && !lock ? "flex" : "none",
                pointerFilter: "block"
            }
        }

        let nonScaledWidthP =
            this.findNumberOfPersentage(
                uiTransformProps.width && uiTransformProps.width != "auto" ? uiTransformProps.width.toString() ?? "70%" : "70%"
            ) * this.tweenProps.s
        let nonScaledHeightP =
            this.findNumberOfPersentage(
                uiTransformProps.height && uiTransformProps.height != "auto" ? uiTransformProps.height.toString() ?? "70%" : "70%"
            ) * this.tweenProps.s

        return {
            width: `${nonScaledWidthP}%`,
            height: `${nonScaledHeightP}%`,
            positionType: uiTransformProps.positionType ?? "absolute",
            position: uiTransformProps.position ?? { left: "370%", bottom: "10%" },
            display: this.enabled && !lock ? "flex" : "none",
            pointerFilter: "block"
        }
    }
    public render = () => (
        <UiEntity
            key={this.template.id + " button"}
            uiTransform={this.getTransform(this.template?.ui?.uiTransform)}
            uiBackground={
                this.template.ui?.uiBackground 
                ?? 
                {color: Color4.Blue()}
            }
            onMouseDown={() => {
                this.buttonClick()
            }}
        >
            <UiEntity
                uiTransform={{
                    width: canvasWidth * 0.02,
                    height: canvasWidth * 0.02,
                    positionType: "absolute",
                    position: { top: "-8%" },

                    display:
                        this.template.markable &&
                        settings.properties.markAskedQuestions &&
                        engineInstance.getUiController().isMarked(this.template.id)
                            ? "flex"
                            : "none",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                uiBackground={{
                    textureMode: "stretch",
                    texture: {
                        src: "images/ui/UI_separate png/checkMark_d1.png"
                    }
                }}
            />
        </UiEntity>
    )
}
