import { AudioSource, Entity, Transform, engine } from "@dcl/sdk/ecs"
import { Vector3 } from "@dcl/sdk/math"
import { timers } from "@dcl-sdk/utils"

export class SoundController {
    private musicEntities: Entity[] = []
    private soundEntities: Entity[] = []

    private musicVolume: number = 1
    private soundVolume: number = 1
    private speechVolume: number = 1

    public setMusicVolume(volume: number) {
        volume = Math.round(volume * 10) / 10
        // console.log("Setting music volume to " + volume)
        if (this.musicVolume == volume) {
            return
        }
        this.musicVolume = volume
        this.musicEntities.forEach(entity => {
            if (AudioSource.getMutable(entity).playing) {
                AudioSource.getMutable(entity).playing = false
                AudioSource.getMutable(entity).volume = volume
                timers.setTimeout(() => {
                    AudioSource.getMutable(entity).playing = true
                }, 2)
            }
        })
    }

    public setSpeechVolume(volume: number) {
        this.speechVolume = volume
    }

    public setSoundVolume(volume: number) {
        volume = Math.round(volume * 10) / 10
        // console.log("Setting sound volume to " + volume)
        if (this.soundVolume == volume) {
            return
        }
        this.soundVolume = volume
    }

    public playMusicSound(filepath: string, loop: boolean, source: Vector3) {
        try {
            for (let entity of this.musicEntities) {
                this.stopMusicSound(entity)
            }

            // console.log("playing " + filepath)
            let entity = engine.addEntity()
            Transform.create(entity, {
                position: source
            })
            AudioSource.create(entity, {
                loop: loop,
                volume: this.musicVolume,
                audioClipUrl: filepath,
                playing: true
            })
            this.musicEntities.push(entity)
            return entity
        } catch (e) {
            console.error(e)
        }
    }

    public playSound(filepath: string, loop: boolean, source: Vector3) {
        try {
            let entity = engine.addEntity()
            Transform.create(entity, {
                position: source
            })
            AudioSource.create(entity, {
                loop: loop,
                volume: this.musicVolume,
                audioClipUrl: filepath,
                playing: true
            })
            this.soundEntities.push(entity)
            timers.setTimeout(() => {
                engine.removeEntity(entity)
            }, 600000)
            return entity
        } catch (e) {
            console.error(e)
        }
    }

    public playSpeechSound(filepath: string, source: Vector3) {
        try {
            let entity = engine.addEntity()
            Transform.create(entity, {
                position: source
            })
            AudioSource.create(entity, {
                loop: false,
                volume: this.speechVolume * 0.3,
                audioClipUrl: filepath,
                playing: true
            })
            timers.setTimeout(() => {
                engine.removeEntity(entity)
            }, 1000)
            return entity
        } catch (e) {
            console.error(e)
        }
    }

    public stopMusicSound(entity: Entity) {
        try {
            let index = this.musicEntities.indexOf(entity)
            if (index > -1) {
                this.musicEntities.splice(index, 1)
            }
            AudioSource.getMutable(entity).playing = false
            engine.removeEntity(entity)
        } catch (e) {
            console.error(e)
        }
    }
}

export let soundController = new SoundController()
