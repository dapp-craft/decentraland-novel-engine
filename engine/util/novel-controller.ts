import Frame from "../sequence/frame"
import Sequence from "../sequence/sequence"

export abstract class NovelController {
    abstract onPreLoadFrame(frame: Frame): void
    abstract onPostLoadFrame(frame: Frame): void
    abstract setSequences(seq: Sequence[]): void
}
