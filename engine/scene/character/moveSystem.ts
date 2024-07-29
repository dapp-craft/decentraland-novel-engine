import { Entity, Transform, engine } from "@dcl/sdk/ecs"
import IFrameCharacter from "../../parser/interface/i-frame-character"
import { Character } from "./character"
import { engineInstance } from "../../engine"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import { cameraChild } from "../../../factory"

export function getCharacterPosition(id: number) {
    let v = Vector3.create(id / 10, -0.43, 0.5)
    return v
}

let Roations = [
    Quaternion.fromEulerDegrees(0, 150, 0),
    Quaternion.fromEulerDegrees(0, 220, 0), //left
    Quaternion.fromEulerDegrees(0, 140, 0), //right
    Quaternion.fromEulerDegrees(0, 180, 0), // front
    Quaternion.fromEulerDegrees(0, 0, 0), // back
    Quaternion.fromEulerDegrees(0, 180, 0) // none
]

let movers: Character[] = []
let k = 0

let cameraTarget: Vector3 = Vector3.Zero()
export function moveCamera(position: number) {
    cameraTarget = Vector3.create(-position / 9, 0, 0)
}
export function moveChars(chars: IFrameCharacter[]) {
    if (chars == undefined) return
    movers = engineInstance.characterController.getCharacters()
    for (let i = 1; i < movers.length; i++) {
        let changed = false
        for (let j = 0; j < chars.length; j++) {
            if (chars[j].characterShortId == i) {
                if (i == 11) continue
                movers[i].targetRotation = Roations[chars[j].directionOfView]
                movers[i].targetPosition = getCharacterPosition(chars[j].position)
                changed = true
                break
            }
        }
    }
    k += 1
}
export function moveCharsImmediately(chars: IFrameCharacter[]) {
    if (chars == undefined) return

    movers = engineInstance.characterController.getCharacters()

    for (let i = 1; i < movers.length; i++) {
        let changed = false
        for (let j = 0; j < chars.length; j++) {
            if (chars[j].characterShortId == i) {
                movers[i].Teleport(getCharacterPosition(chars[j].position), Roations[chars[j].directionOfView])
                changed = true
                break
            }
        }
    }
    k += 1
}

engine.addSystem(Update)

// region SHAKING
let cameraShakingEnabled = false
let shakeTime = 0.4
let currentShakeTime = 0
let steps = 8
let curStep = 0
let _intensity = 0
let position: Vector3
export function setShakeData(intensity: number) {
    curStep = 0
    currentShakeTime = 0
    position
    if (intensity < 0.001) {
        cameraShakingEnabled = false
        return
    }
    position = Transform.get(cameraChild).position
    cameraShakingEnabled = true
    _intensity = intensity
}
function generateShakeOffset(intensity: number) {
    let x = (Math.random() - 0.5) * intensity
    let y = (Math.random() - 0.5) * intensity
    let z = 0
    return Vector3.create(x, y, z)
}
let generalOffset: Vector3 = Vector3.Zero()
let currentOffset: Vector3 = Vector3.Zero()
//  endregion SHAKING

function ShiftObject(ent: Entity, target: Vector3, speed: number) {
    let a = Transform.get(ent).position
    Transform.getMutable(ent).position = Vector3.lerp(Transform.getMutable(ent).position, target, speed)
}
function Update(dt: number) {
    let cameraPos = Transform.get(cameraChild).position

    for (let i = 0; i < movers.length; i++) {
        if (i == 1) movers[i].Move(0.9)
        else movers[i].Move(0.5)
        movers[i].Rotate(0.3)
        movers[i].AnimateByWeights()
    }
    //SHAKING
    if (cameraShakingEnabled) {
        if (steps - 1 < curStep) {
            cameraShakingEnabled = false
            // console.log("CLOSE")
        }

        if ((shakeTime / steps) * curStep < currentShakeTime) {
            // console.log("CURRENT TIME: " + currentShakeTime + ", step " + curStep)
            curStep += 1
            currentOffset = generateShakeOffset(_intensity)
            if (curStep == steps - 1) currentOffset = Vector3.Zero()
        }
        currentShakeTime += dt
        ShiftObject(cameraChild, Vector3.add(position, currentOffset), 0.1 + _intensity / 2)
    } else {
        Transform.getMutable(cameraChild).position = Vector3.lerp(cameraPos, cameraTarget, 0.3)
    }
}
