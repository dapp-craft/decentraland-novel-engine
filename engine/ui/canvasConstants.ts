import { timers } from "@dcl-sdk/utils"
import { UiCanvasInformation, engine } from "@dcl/sdk/ecs"

// canvas = CanvasInformation or underfined
export let canvasHeight = 960
export let canvasWidth = 1728
let canGet = false
timers.setTimeout(() => {
    canGet = true
}, 100)
engine.addSystem(updateWith)
function updateWith() {
    if (canGet) {
        canvasHeight = UiCanvasInformation.get(engine.RootEntity).height
        canvasWidth = UiCanvasInformation.get(engine.RootEntity).width
    }
}
