import IFrameCharacter from "../parser/interface/i-frame-character"
import IFrameParameters from "../parser/interface/i-frame-parameters"
import IButton from "./i-button"

export default class Frame {
    constructor(
        public readonly id: string,
        public readonly technicalName: string,
        public readonly parentSequence: string,
        public readonly text: string,
        public readonly speaker: string,
        public readonly characters: IFrameCharacter[],
        public readonly buttons: IButton[], // at least one button is required
        public readonly parameters: IFrameParameters,
        public readonly action: string | undefined,
        public readonly inputCondition: string | undefined,
        public readonly menuText: string | undefined
    ) {}
}
