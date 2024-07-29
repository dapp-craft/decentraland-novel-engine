import BubbleSpeech from "../enum/enum-bubble-speech"
import NodeType from "../enum/enum-type-node"
import IAudioAsset from "./assets/i-audio"
import IImageAsset from "./assets/i-image"

export default interface IFrameParameters {
    typeNode: NodeType
    autoScrollingTimer: number | undefined
    soundEffect: IAudioAsset | undefined
    sceneOverlay: IImageAsset | undefined
    bubbleSpeech: BubbleSpeech
    speedSpeech: number
    shakeCameraIntensity: number
    moveCamera: number
    hpButtonName: string
    showHpButton: boolean
    sceneBackground: IImageAsset | undefined
    title: string | undefined
}
