enum BubbleSpeech {
    Thoughts = 1,
    Normal = 2,
    Outcry = 3,
    None = 4
}
export function bubbleByEnum(speech: BubbleSpeech) {
    switch (speech) {
        case BubbleSpeech.Thoughts:
            return "images/bubbles/bubbleThought.png"
        case BubbleSpeech.Normal:
            return "images/bubbles/bubbleSpeech.png"
        case BubbleSpeech.Outcry:
            return "images/bubbles/bubbleShout.png"
        default:
            return "images/bubbles/bubbleSpeech.png"
    }
}

export let bubbles = ["images/bubbles/bubbleThought.png", "images/bubbles/bubbleThought.png", "images/bubbles/bubbleThought.png"]
export function setAllBubbleFiles() {
    bubbles = ["images/bubbles/bubbleThought.png", "images/bubbles/bubbleSpeech.png", "images/bubbles/bubbleShout.png"]
}
export function getAllBubbleFiles() {
    return ["images/bubbles/bubbleThought.png", "images/bubbles/bubbleSpeech.png", "images/bubbles/bubbleShout.png"]
}

export default BubbleSpeech
