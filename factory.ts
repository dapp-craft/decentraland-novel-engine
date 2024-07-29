import {
    Entity,
    engine,
    Transform,
    MeshRenderer,
    MeshCollider,
    Material,
    TransformType,
    GltfContainer,
    MaterialTransparencyMode,
    CameraType,
    CameraModeArea,
    AvatarModifierType,
    AvatarModifierArea
} from "@dcl/sdk/ecs"
import { Cube } from "./components"
import { Color4, Quaternion, Vector3 } from "@dcl/sdk/math"
import { getRandomHexColor } from "./utils"
import { timers } from "@dcl-sdk/utils"
import { movePlayerTo } from "~system/RestrictedActions"
import { ICharacterWithParent } from "./engine/scene/character/character-controller"
// collider Type enum
export enum CollliderType {
    BOX = "box",
    MESH = "mesh",
    NONE = "none"
}

export let playerChildren: Entity[] = []
export let cameraChild: Entity = engine.addEntity()
Transform.create(cameraChild, {
    position: Vector3.Zero(),
    rotation: Quaternion.Identity(),
    scale: Vector3.One(),
    parent: engine.CameraEntity
})
// Cube factory
export function createObject(transformArgs: TransformType, meshPath: string, isPlayerChild = true, colliderType: CollliderType): Entity {
    const entity = engine.addEntity()

    // Used to track the cubes
    Cube.create(entity)

    Transform.create(entity, {
        position: transformArgs.position,
        rotation: transformArgs.rotation,
        parent: isPlayerChild ? cameraChild : engine.RootEntity,
        scale: transformArgs.scale
    })

    // set how the cube looks and collides

    switch (colliderType) {
        case CollliderType.BOX:
            GltfContainer.create(entity, { src: meshPath })
            MeshCollider.setBox(entity)
            break
        case CollliderType.MESH:
            GltfContainer.create(entity, { src: meshPath })
            MeshCollider.setBox(entity)
            break
        case CollliderType.NONE:
            GltfContainer.create(entity, { src: meshPath })
            break
    }
    Material.setPbrMaterial(entity, { albedoColor: Color4.fromHexString(getRandomHexColor()), castShadows: false, roughness: 0 })
    if (isPlayerChild) playerChildren.push(entity)
    return entity
}
export function spawnCharacter(transformArgs: TransformType, meshPath: string): ICharacterWithParent {
    const entityParent = engine.addEntity()

    Transform.create(entityParent, { position: Vector3.Zero(), rotation: Quaternion.Identity(), parent: cameraChild, scale: Vector3.One() })
    playerChildren.push(entityParent)

    const character = engine.addEntity()

    Transform.create(character, {
        position: transformArgs.position,
        rotation: transformArgs.rotation,
        parent: entityParent,
        scale: transformArgs.scale
    })

    GltfContainer.create(character, { src: meshPath })
    return { char: character, parent: entityParent }
}
export function createCube(transformArgs: TransformType, transparent = false, isPlayerChild = true): Entity {
    const entity = engine.addEntity()

    // Used to track the cubes
    Cube.create(entity)

    Transform.create(entity, {
        position: transformArgs.position,
        rotation: transformArgs.rotation,
        parent: isPlayerChild ? cameraChild : engine.RootEntity,
        scale: transformArgs.scale
    })

    // set how the cube looks and collides
    if (!transparent) MeshRenderer.setBox(entity)
    MeshCollider.setBox(entity)

    Material.setPbrMaterial(entity, {
        albedoColor: Color4.create(0, 0, 0, 0.01),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST
    })
    if (isPlayerChild) playerChildren.push(entity)

    return entity
}
export function createPlane(transformArgs: TransformType, texture: string = "", isPlayerChild = true): Entity {
    const entity = engine.addEntity()

    // Used to track the cubes
    Cube.create(entity)

    Transform.create(entity, {
        position: transformArgs.position,
        rotation: transformArgs.rotation,
        parent: isPlayerChild ? cameraChild : engine.RootEntity,
        scale: transformArgs.scale
    })

    // set how the cube looks and collides
    MeshRenderer.setBox(entity)
    Material.setBasicMaterial(entity, {
        texture: Material.Texture.Common({
            src: texture
        })
    })
    if (isPlayerChild) playerChildren.push(entity)
    return entity
}

export function createLight() {
    const light = engine.addEntity()
}

export function buildMap() {
    const entity = engine.addEntity()

    AvatarModifierArea.create(entity, {
        area: Vector3.create(10, 10, 10),
        modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
        excludeIds: []
    })

    Transform.create(entity, {
        position: Vector3.create(8, 8, 8)
    })

    CameraModeArea.create(entity, {
        area: Vector3.create(10, 10, 10),
        mode: CameraType.CT_FIRST_PERSON
    })
    let showCatch = true

    createCube(
        { position: Vector3.create(8, 16, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(15, 1, 15) },
        false,
        false
    )
    createCube(
        { position: Vector3.create(8, 1, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(15, 1, 15) },
        false,
        false
    )
    createCube(
        { position: Vector3.create(1, 8, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(1, 15, 15) },
        false,
        false
    )
    createCube(
        { position: Vector3.create(16, 8, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(1, 15, 15) },
        false,
        false
    )
    createCube(
        { position: Vector3.create(8, 8, 1), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(15, 15, 1) },
        false,
        false
    )
    createCube(
        { position: Vector3.create(8, 8, 16), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(15, 15, 1) },
        false,
        false
    )

    createCube(
        { position: Vector3.create(8, 13, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.One() },
        showCatch,
        false
    )
    createCube(
        { position: Vector3.create(8, 10, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.One() },
        showCatch,
        false
    )
    createCube(
        { position: Vector3.create(9, 12, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(1, 2, 1) },
        showCatch,
        false
    )
    createCube(
        { position: Vector3.create(8, 12, 9), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(1, 2, 1) },
        showCatch,
        false
    )
    createCube(
        { position: Vector3.create(7, 12, 8), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(1, 2, 1) },
        showCatch,
        false
    )
    createCube(
        { position: Vector3.create(8, 12, 7), rotation: Quaternion.fromEulerDegrees(0, 0, 0), scale: Vector3.create(1, 2, 1) },
        showCatch,
        false
    )

    // Defining behavior. See `src/systems.ts` file.
    timers.setTimeout(() => {
        movePlayerTo({
            newRelativePosition: Vector3.create(8, 12, 8),
            cameraTarget: Vector3.create(10, 13, 10)
        })
    }, 200)
}
