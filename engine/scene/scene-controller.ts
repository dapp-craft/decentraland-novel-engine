import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs"
import Frame from "../sequence/frame"
import { cameraChild } from "../../factory"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { moveCamera, moveChars, moveCharsImmediately, setShakeData } from "./character/moveSystem"
import IFrameCharacter from "../parser/interface/i-frame-character"
import BubbleSpeech from "../parser/enum/enum-bubble-speech"
import NodeType from "../parser/enum/enum-type-node"
import Sequence from "../sequence/sequence"
import { settings } from "../ui/settings"
import { soundController } from "../util/sound-controller"
import { engineInstance } from "../engine"
import { NovelController } from "../util/novel-controller"

interface valuePair {
    x: number
    y: number
}
function buildBackground(path: string): Entity {
    let e = engine.addEntity()
    Transform.create(e, {
        position: Vector3.create(0, 0, 2.22),
        scale: Vector3.create(0.15, 0.15, 0.15),
        rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
        parent: cameraChild
    })
    GltfContainer.create(e, {
        src: path
    })
    return e
}

export default class SceneController extends NovelController {
    private _backgroundEntitiesDict: { [key: string]: Entity } = {}

    public setSequences(sequences: Sequence[]) {
        for (let sequence of sequences) {
            sequence.frames.forEach(frame => {
                let background = frame.parameters.sceneBackground
                if (background && !this._backgroundEntitiesDict[background.id]) {
                    this._backgroundEntitiesDict[background.id] = buildBackground(
                        "models/glb/" + background.filePath.split("/")[2].split(".")[0] + ".glb"
                    )
                }
            })
        }
    }
    public onPreLoadFrame(frame: Frame): void {}
    public onPostLoadFrame(frame: Frame) {
        if (frame.parameters.sceneBackground) {
            for (let backgroundId in this._backgroundEntitiesDict) {
                if (backgroundId == frame.parameters.sceneBackground.id) {
                    Transform.getMutable(this._backgroundEntitiesDict[backgroundId]).scale = Vector3.create(0.15, 0.15, 0.15)
                } else {
                    Transform.getMutable(this._backgroundEntitiesDict[backgroundId]).scale = Vector3.Zero()
                }
            }
        }
        setShakeData(frame.parameters.shakeCameraIntensity / 10)

        moveChars(frame.characters)
        moveCamera(frame.parameters.moveCamera)

        if (frame.parameters.soundEffect) {
            //   playSound(frame.parameters.soundEffect.filePath, false,soundPosition)
            soundController.playSound(frame.parameters.soundEffect.filePath, false, Transform.get(cameraChild).position)
        }
        if (frame.parameters.typeNode == NodeType.Service) {
            moveCharsImmediately(frame.characters)
        }
        this.changeEmotions(frame.characters, frame)
    }
    public changeEmotions(chars: IFrameCharacter[], frame: Frame) {
        for (let i = 0; i < chars.length; i++) {
            engineInstance.characterController
                .getCharacter(chars[i].characterShortId)
                .SetAnimation(
                    chars[i].animations,
                    frame.speaker == engineInstance.characterController.getCharacter(chars[i].characterShortId).charData.id &&
                        frame.parameters.bubbleSpeech != BubbleSpeech.None &&
                        frame.parameters.bubbleSpeech != BubbleSpeech.Thoughts
                )
        }
    }
}

export let soundPosition = Vector3.add(Vector3.create(0, (settings.properties.musicVolume - 1) * 5, 0), Transform.get(cameraChild).position)
function updateSoundPosition() {
    if (Math.abs(soundPosition.y / 5 + 1 - settings.properties.musicVolume) > 0.05) {
        soundPosition = Vector3.add(Vector3.create(0, (settings.properties.musicVolume - 1) * 5, 0), Transform.get(cameraChild).position)
    }
}
engine.addSystem(updateSoundPosition)
