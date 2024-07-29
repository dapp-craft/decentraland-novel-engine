import { engineInstance } from "../../engine"
import IButton from "../../sequence/i-button"

export default class Button {
    private _text: string = ""
    private _targetFrame: string = ""

    constructor() {}

    public get targetFrame(): string {
        return this._targetFrame
    }

    public show(data: IButton) {
        this._targetFrame = data.targetFrame
        this._text = data.text
    }

    public click() {
        engineInstance.showFrame(this._targetFrame)
    }
}
