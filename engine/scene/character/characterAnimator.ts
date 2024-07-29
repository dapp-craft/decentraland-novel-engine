import { engine } from "@dcl/sdk/ecs"
import { engineInstance } from "../../engine"
import { timers } from "@dcl-sdk/utils"

timers.setTimeout(() => {
    engineInstance.characterController.getCharacters()
}, 2)
export let characters = engineInstance.characterController.getCharacters()

engine.addSystem(AnimateByWeights)
export function AnimateByWeights() {
    for (let i = 0; i < characters.length; i++) {
        characters[i].AnimateByWeights()
    }
}
