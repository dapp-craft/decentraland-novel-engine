import IAudioAsset from "./assets/i-audio"
import IImageAsset from "./assets/i-image"
import ICondition from "./i-condition"
import IFrame from "./i-frame"

export default interface ISequence {
    id: string
    technicalName: string
    displayName: string
    targetSequence: string
    frames: IFrame[]
    conditions: ICondition[]
    themeSong: IAudioAsset | undefined
    themeBackground: IImageAsset | undefined
    chapter: string
    firstFrame: string
}
