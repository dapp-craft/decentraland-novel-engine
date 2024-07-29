import { engineInstance } from "../engine"
import Frame from "../sequence/frame"

export default class UiStaticMethods {
    public static addNewLine(text: string = "", fontSize: number, width: number) {
        let maxLineLength = (width / fontSize) * 2.1
        let paragraphs = text.split("\n")
        let lines = []
        for (let str of paragraphs) {
            while (str.length > 0) {
                if (str.length > maxLineLength) {
                    let i = str.substring(0, maxLineLength).lastIndexOf(" ")
                    if (i > 20) {
                        lines.push(str.substring(0, i).trim())
                        str = str.substring(i).trim()
                    } else {
                        lines.push(str.substring(0, maxLineLength))
                        str = str.substring(maxLineLength)
                    }
                } else {
                    lines.push(str)
                    break
                }
            }
        }
        let newText = lines.join("\n")
        return newText
    }
    public static removeSpecificSymbols(text: string) {
        let txt = ""
        for (let i = 0; i < text.length; i++) {
            if (text[i] == "^" || text[i] == "\n") continue
            txt += text[i]
        }
        return txt
    }
    public static getSpeakerName(stage = "", frame: Frame) {
        let name = engineInstance.findSpeaker(frame.speaker)
        if (stage != "") return stage
        return name == "Nobody" ? "Notification" : name
    }
}
