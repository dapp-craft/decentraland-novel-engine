import { TransformType } from "@dcl/sdk/ecs"

export interface ICharacterSpawnProps {
    shortId: number
    transformArgs: TransformType
}
export interface ICharacterTemplate {
    // array of animations
    animations: string[]
    spawnProps: ICharacterSpawnProps
    mesh: string
}
