import IAudioAsset from "./assets/i-audio"

export default interface ICharacter {
    id: string
    technicalName: string
    shortId: number
    displayName: string
    asset: string
    textSound: IAudioAsset | undefined
}
