import { Animator, Entity, PBAnimationState, Transform } from "@dcl/sdk/ecs"
import { Quaternion, Vector3 } from "@dcl/sdk/math"
import ICharacter from "../../parser/interface/i-character"
import { getCharacterPosition } from "./moveSystem"

export class Character {
    public currentSpeed = 0.1
    public targetRotation = Quaternion.fromEulerDegrees(0, 140, 0)
    public targetPosition: Vector3

    public currentAnim: PBAnimationState
    public targetAnim: PBAnimationState
    private isAnimChanging = false
    private clips: PBAnimationState[] = []
    constructor(
        public readonly charData: ICharacter,
        public availableAnimations: string[],
        public charEntity: Entity,
        public parentEntity: Entity
    ) {
        for (let i = 0; i < availableAnimations.length; i++) {
            this.clips.push({
                clip: availableAnimations[i],
                weight: 0,
                playing: false,
                loop: true
            })
        }
        this.targetPosition = getCharacterPosition(-15)
        Animator.create(charEntity, {
            states: this.clips
        })
        this.currentAnim = Animator.getClip(this.charEntity, this.clips[0].clip)
        this.currentAnim.playing = true
        this.currentAnim.weight = 1

        this.targetAnim = Animator.getClip(this.charEntity, this.clips[1].clip)

        Transform.getMutable(this.parentEntity).position = getCharacterPosition(-15)
    }

    public Move(speed: number): void {
        Transform.getMutable(this.parentEntity).position = Vector3.lerp(
            Transform.get(this.parentEntity).position,
            this.targetPosition,
            speed
        )
    }

    public Rotate(speed: number): void {
        Transform.getMutable(this.parentEntity).rotation = Quaternion.slerp(
            Transform.get(this.parentEntity).rotation,
            this.targetRotation,
            speed
        )
    }

    public Teleport(pos: Vector3, rot: Quaternion) {
        this.targetPosition = pos
        this.targetRotation = rot
        Transform.getMutable(this.parentEntity).position = pos
        Transform.getMutable(this.parentEntity).rotation = rot
    }

    private FindClip(title: string) {
        for (let i = 0; i < this.clips.length; i++) {
            if (this.clips[i].clip == title) {
                return Animator.getClip(this.charEntity, this.clips[i].clip)
            }
        }
        return null
    }

    public SetAnimation(title: string | undefined, isSpeech: boolean) {
        if (!title) return
        // console.log("Setting animation for character " + this.charData.displayName + ", " +title)
        // if title ends _1 remove it
        title = title.replace("_01", "")
        if (isSpeech) title = title + "_talk"
        else {
            if (title.includes("talk")) title = title.replace("_talk", "")
        }
        //   Animator.playSingleAnimation(this.charEntity, title);§

        this.targetAnim.weight = 0
        this.targetAnim.playing = false
        this.targetAnim = this.FindClip(title) ?? this.currentAnim

        this.logChar("SetAnimation " + this.targetAnim.clip)
        this.logChar(
            "OnSetAnimation prev: " +
                this.currentAnim.weight +
                this.currentAnim.clip +
                "      target: " +
                this.targetAnim.weight +
                this.targetAnim.clip
        )

        this.currentAnim.playing = true
        this.targetAnim.playing = true

        // this.clips.forEach(clip => {
        //     if (clip.playing) {
        //         this.logChar("playing clip " + clip.clip)
        //     }
        // })

        this.isAnimChanging = true
    }

    public AnimateByWeights() {
        this.logCurrent()

        if (!this.currentAnim.weight || !this.targetAnim.weight) {
            //prev = 1, target = 0. -> prev = 0, target = 1. prev = 1
            // this.currentAnim.playing = true;
            // this.targetAnim.playing = true;

            if (!this.currentAnim.weight) {
                this.currentAnim.weight = 1
            }
        }
        if (this.isAnimChanging) {
            if (this.targetAnim.clip == this.currentAnim.clip) this.isAnimChanging = false

            this.currentAnim.weight = Math.max(0, this.currentAnim.weight - 0.05)
            this.targetAnim.weight = 1 - this.currentAnim.weight

            this.logChar(
                "prev: " +
                    this.currentAnim.weight +
                    this.currentAnim.clip +
                    "      target: " +
                    this.targetAnim.weight +
                    this.targetAnim.clip
            )

            if (this.currentAnim.weight < 0.02) {
                //     this.currentAnim.playing = false;

                //this.currentAnim = this.targetAnim;
                this.currentAnim = Animator.getClip(this.charEntity, this.targetAnim.clip)

                this.isAnimChanging = false
                this.logChar("End animate")
                this.logChar(
                    "prev: " +
                        this.currentAnim.weight +
                        this.currentAnim.clip +
                        "      target: " +
                        this.targetAnim.weight +
                        this.targetAnim.clip
                )
                this.clips.forEach(clip => {
                    if (clip.playing) {
                        this.logChar("playing clip " + clip.clip + clip.weight)
                    }
                })
            }
        }
    }

    private logChar(value: string) {
        // if(this.charData.shortId == 1){
        //  // console.log("[Character " + this.charData.displayName + "] " + value)
        // }
    }

    private logFull() {
        if (this.charData.shortId == 1) {
            this.clips.forEach(clip => {
                let aboba = this.FindClip(clip.clip)
                if (!aboba?.playing) {
                    return
                }
                // console.log("=====================");
                // console.log("Clip: " + aboba?.clip);
                // console.log("Playing: " + aboba.playing);
                // console.log("Ves: " + aboba.weight);

                // console.log("=====================");
            })
        }
    }

    private logCurrent() {
        // if(this.charData.shortId == 1){
        let aboba = this.FindClip(this.currentAnim.clip)
        if (!aboba?.playing) {
            return
        }
        //    // console.log("=CURRENT= " + "Clip: " + aboba?.clip + " Playing: " + aboba.playing + " Ves: " + aboba.weight);
        // }
    }
}
