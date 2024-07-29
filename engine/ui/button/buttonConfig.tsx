import { InputAction, PointerEventType, engine, inputSystem } from "@dcl/sdk/ecs"
import IButton from "../../sequence/i-button"
import { IButtonTemplate, RenderedButton } from "./renderedButton"

export class ButtonConfig {
    public renderedButtons: RenderedButton[] = []

    public constructor(buttonTemplates: IButtonTemplate[]) {
        buttonTemplates.forEach(e => {
            this.add(e)
        })
    }
    private add(button: IButtonTemplate) {
        this.renderedButtons.push(new RenderedButton(button))
    }

    public getButton(id: string) {
        let button = this.renderedButtons.find(v => v.template.id == id)
        return button
    }
    public refresh() {
        // console.log("REFRESHING")
        for (let i = 0; i < this.renderedButtons.length; i++) {
            this.renderedButtons[i].setActive(false)
        }

        clickSimulations = []
    }
    public changeButton(ibutton: IButton) {
        let b = this.renderedButtons.find(v => v.template.id == ibutton.text)
        if (b) {
            b.setActive(true)
            b.targetFrame = ibutton.targetFrame
            if (b.template.hotKey)
                clickSimulations.push({
                    inputAction: b.template.hotKey,
                    callback: () => {
                        b?.buttonClick()
                    }
                })
        }
    }
}
//export const buttonConfig = new ButtonConfig();

interface SimulateClick {
    inputAction: InputAction
    callback: () => void
}
export let clickSimulations: SimulateClick[] = []
engine.addSystem(inputActionsListener)
function inputActionsListener() {
    for (let i = 0; i < clickSimulations.length; i++) {
        const cmd1 = inputSystem.getInputCommand(
            //   InputAction.IA_PRIMARY,
            clickSimulations[i].inputAction,
            PointerEventType.PET_DOWN
        )
        if (cmd1) {
            // // console.log("CLICK " + clickSimulations[i].inputAction)
            clickSimulations[i].callback()
        }
    }
}
