import { engine } from "@dcl/sdk/ecs"

export class Tween {
    private object: any
    private valuesStart: any = {}
    private valuesEnd: any = {}
    private duration: number = 1000
    private delayTime: number = 0
    private startTime: number = 0
    private prefer_function: (x: number) => number = x => this.easeInOutCubic(x)
    private onUpdateCallback: () => void = () => {}
    private onCompleteCallback: () => void = () => {}
    private onStartCallback: () => void = () => {}
    private isPlaying: boolean = false
    private updateL: void | null = null
    private chainTweens: Tween[] = []
    constructor(object: any) {
        this.object = object
        this.updateL = engine.addSystem(() => {
            this.update()
        })
    }

    to(valuesEnd: any, duration: number) {
        this.valuesEnd = valuesEnd
        if (duration !== undefined) {
            this.duration = duration
        }
        return this
    }
    set_prefer_function(name: string) {
        // find the function by name here
        switch (name) {
            case "Cubic":
                this.prefer_function = this.easeInOutCubic
                break
            case "Back":
                this.prefer_function = this.easeInOutBack
                break
            case "Elastic":
                this.prefer_function = this.easeInOutExpo
                break
            default:
                this.prefer_function = this.easeInOutCubic
                break
        }
        return this
    }

    start(delayTime: number = 0) {
        this.isPlaying = true
        this.startTime = Date.now() + delayTime

        for (let property in this.valuesEnd) {
            // This prevents the engine from interpolating values that don't exist
            if (this.object[property] === undefined) {
                continue
            }
            this.valuesStart[property] = this.object[property]
        }
        this.onStartCallback()

        return this
    }

    stop() {
        if (!this.isPlaying) {
            return this
        }
        this.isPlaying = false
        if (this.onCompleteCallback !== null) {
            this.onCompleteCallback.call(this.object)
        }
        return this
    }
    // write some easing function
    easeInOutCubic(x: number): number {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
    }
    easeInOutBack(x: number): number {
        const c1 = 1.70158
        const c2 = c1 * 1.525

        return x < 0.5
            ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
            : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2
    }
    easeInOutExpo(x: number): number {
        const c4 = (2 * Math.PI) / 3

        const result = x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1

        return Math.max(0.0001, Math.min(0.9999, result))
    }

    delay(amount: number) {
        this.delayTime = amount
        return this
    }

    onComplete(callback: () => void) {
        this.onCompleteCallback = callback
        return this
    }

    onStart(callback: () => void) {
        this.onStartCallback = callback
        return this
    }

    update() {
        if (!this.isPlaying) {
            return false
        }
        let elapsed = Date.now() - this.startTime
        let complete = false
        let t = Math.min(1, Math.max(0, elapsed / this.duration))
        let v = this.prefer_function(t)
        for (let property in this.valuesEnd) {
            let start = this.valuesStart[property] || 0
            let end = this.valuesEnd[property]
            let value = start + (end - start) * v
            this.object[property] = value
        }
        if (t === 1) {
            this.isPlaying = false
            if (this.onCompleteCallback !== null) {
                this.onCompleteCallback.call(this.object)
                for (let i = 0; i < this.chainTweens.length; i++) {
                    this.chainTweens[i].start()
                }
            }
            complete = true
        }
        if (this.onUpdateCallback !== null) {
            this.onUpdateCallback.call(this.object)
        }
        return complete
    }

    chain(tween: Tween) {
        this.chainTweens.push(tween)
    }
}
