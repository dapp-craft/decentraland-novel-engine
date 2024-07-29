import IAudioAsset from "../parser/interface/assets/i-audio"
import IImageAsset from "../parser/interface/assets/i-image"
import ICondition from "../parser/interface/i-condition"
import Frame from "./frame"

export default class Sequence {
    private _id: string
    private _technicalName: string
    private _displayName: string
    private _targetSequence: string
    private _frames: Frame[]
    private _conditions: ICondition[]
    private _themeSong: IAudioAsset | undefined
    private _themeBackground: IImageAsset | undefined
    private _chapter: string
    private _firstFrame: string

    constructor(
        frames: Frame[],
        id: string,
        technicalName: string,
        displayName: string,
        targetSequence: string,
        conditions: ICondition[],
        themeSong: IAudioAsset | undefined,
        themeBackground: IImageAsset | undefined,
        chapter: string,
        firstFrame: string
    ) {
        this._frames = frames
        this._id = id
        this._technicalName = technicalName
        this._displayName = displayName
        this._targetSequence = targetSequence
        this._conditions = conditions
        this._themeSong = themeSong
        this._themeBackground = themeBackground
        this._chapter = chapter
        this._firstFrame = firstFrame
    }

    public addFrame(frame: Frame) {
        this._frames.push(frame)
    }

    get id() {
        return this._id
    }

    get technicalName() {
        return this._technicalName
    }

    get displayName() {
        return this._displayName
    }

    get targetSequence() {
        return this._targetSequence
    }

    get frames() {
        return this._frames
    }

    get conditions() {
        return this._conditions
    }

    get themeSong() {
        return this._themeSong
    }

    get themeBackground() {
        return this._themeBackground
    }

    get chapter() {
        return this._chapter
    }

    get firstFrame() {
        return this._firstFrame
    }
}
