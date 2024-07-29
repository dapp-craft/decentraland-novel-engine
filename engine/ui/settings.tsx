import ReactEcs, { UiEntity } from "@dcl/sdk/react-ecs"
import { canvasWidth } from "./canvasConstants"
import { palette } from "./palette"
import { soundController } from "../util/sound-controller"
import { Color4 } from "@dcl/sdk/math"

interface SettingsProps {
    musicVolume: number
    speechVolume: number
    textSpeed: number
    nextSavePointTitle: string
    markAskedQuestions: boolean
}

let buttonsSize = 0.03
let textSize = 0.015
// props with two buttons less and more and with text in the middle
let settingsVolumeProp = (less: () => void, more: () => void, text: string) => (
    <UiEntity // background
        uiTransform={{
            position: { top: "20%", right: "20%" },
            width: "20%",
            height: "5%",
            margin: "2%",
            alignSelf: "flex-end",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            display: "flex"
        }}
    >
        <UiEntity // less
            uiTransform={{
                width: canvasWidth * buttonsSize,
                height: canvasWidth * buttonsSize, // *menu size
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                display: "flex"
            }}
            uiBackground={{
                textureMode: "stretch",
                texture: {
                    src: "images/ui/UI_separate png/small_back.png"
                }
            }}
            onMouseDown={() => {
                less()
            }}
        />
        <UiEntity // text
            uiTransform={{
                width: "60%",
                height: "100%",

                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                display: "flex"
            }}
        >
            <UiEntity // text
                uiTransform={{
                    position: { bottom: "35%" },
                    alignSelf: "center"
                }}
                uiText={{
                    value: text,
                    color: palette.textBackColor,
                    fontSize: canvasWidth * textSize,
                    textAlign: "middle-center"
                }}
            />
        </UiEntity>
        <UiEntity // more
            uiTransform={{
                width: canvasWidth * buttonsSize,
                height: canvasWidth * buttonsSize,

                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                display: "flex"
            }}
            uiBackground={{
                textureMode: "stretch",
                texture: {
                    src: "images/ui/UI_separate png/small_forward.png"
                }
            }}
            onMouseDown={() => {
                more()
            }}
        />
    </UiEntity>
)

class SettingsOverlay {
    public properties: SettingsProps = {
        musicVolume: 1,
        speechVolume: 1,
        textSpeed: 1.4,
        nextSavePointTitle: "Chapter 1",
        markAskedQuestions: true
    }
    public menuSize = 0.5
    public visible = false

    render = () => (
        <UiEntity
            uiTransform={{
                width: "100%",
                height: "100%",
                positionType: "absolute",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                pointerFilter: "block",
                display: this.visible ? "flex" : "none"
            }}
            uiBackground={{
                color: palette.noteBackground
            }}
        >
            <UiEntity
                uiTransform={{
                    position: { top: "-10%" },
                    width: canvasWidth * this.menuSize,
                    height: canvasWidth * this.menuSize * 0.61,
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "column"
                }}
                uiBackground={{
                    textureMode: "stretch",
                    texture: {
                        src: "images/ui/UI_separate png/IMG_5183.png"
                    }
                }}
            >
                {settingsVolumeProp(
                    () => {
                        settings.properties.musicVolume = Math.max(settings.properties.musicVolume - 0.1, 0)
                        soundController.setMusicVolume(settings.properties.musicVolume)
                        soundController.setSoundVolume(settings.properties.musicVolume)
                    },
                    () => {
                        settings.properties.musicVolume = Math.min(settings.properties.musicVolume + 0.1, 1)
                        soundController.setMusicVolume(settings.properties.musicVolume)
                        soundController.setSoundVolume(settings.properties.musicVolume)
                    },
                    Math.round(this.properties.musicVolume * 100) + "%"
                )}

                {settingsVolumeProp(
                    () => {
                        settings.properties.speechVolume = Math.max(settings.properties.speechVolume - 0.1, 0)
                        soundController.setSpeechVolume(settings.properties.speechVolume)
                    },
                    () => {
                        settings.properties.speechVolume = Math.min(settings.properties.speechVolume + 0.1, 1)
                        soundController.setSpeechVolume(settings.properties.speechVolume)
                    },
                    Math.round(this.properties.speechVolume * 100) + "%"
                )}

                {settingsVolumeProp(
                    () => {
                        settings.properties.textSpeed = Math.max(settings.properties.textSpeed - 0.1, 0.8)
                    },
                    () => {
                        settings.properties.textSpeed = Math.min(settings.properties.textSpeed + 0.1, 1.5)
                    },
                    this.properties.textSpeed > 1.41 ? "∞" : Math.round(this.properties.textSpeed * 100) + "%"
                )}

                <UiEntity // save point
                    uiTransform={{
                        width: "40%",
                        height: "8%",
                        margin: "13%",
                        alignSelf: "flex-end",
                        position: { right: "-2%" }
                    }}
                    uiText={{
                        value: this.properties.nextSavePointTitle,
                        fontSize: canvasWidth * textSize,
                        color: palette.textBackColor
                    }}
                />

                <UiEntity // mark asked questions
                    uiTransform={{
                        width: "100%",
                        height: "13%",
                        position: { top: "64%" },
                        positionType: "absolute",
                        justifyContent: "center",
                        display: "flex"
                    }}
                    onMouseDown={() => {
                        settings.properties.markAskedQuestions = !settings.properties.markAskedQuestions
                    }}
                >
                    <UiEntity // red cross
                        uiTransform={{
                            width: canvasWidth * buttonsSize * 2,
                            height: canvasWidth * buttonsSize * 1.4,
                            position: { right: settings.properties.markAskedQuestions ? "-14%" : "-25%" },
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                            pointerFilter: "none"
                        }}
                        uiBackground={{
                            textureMode: "stretch",
                            texture: {
                                src: "images/ui/UI_separate png/Gesture Thinks.png"
                            }
                        }}
                    />
                </UiEntity>
                <UiEntity
                    uiTransform={{
                        width: canvasWidth * 0.05,
                        height: canvasWidth * 0.05,
                        positionType: "absolute",
                        position: { top: "-5%", right: "10%" }
                    }}
                    onMouseDown={() => {
                        this.visible = false
                    }}
                />
            </UiEntity>
        </UiEntity>
    )
}

export const settings = new SettingsOverlay()
