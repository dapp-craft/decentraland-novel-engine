# Interface: ICharacterTemplate

This interface represents the template for a character in the novel engine. You should describe ALL the characters in the novel engine using this interface for initializing.

## Properties

- `animations` (array of strings): An array of animations that the character can perform.

- `spawnProps` (object of type `ICharacterSpawnProps`): The spawn properties for the character.

- `mesh` (string): The path to the mesh file for the character. This can be a GLB or GLTF file.

## Interface: ICharacterSpawnProps

This interface represents the spawn properties for a character.

### Properties

- `shortId` (number): The short ID of the character.

- `transformArgs` (object of type `TransformType`): The **offset** arguments for the character (if its position doesn't look quite right on stage)

## Example of usage
```typescript
 {
            animations: ["Run", "Jump", "Walk"],
            spawnProps: {
                shortId: 1, // for jones
                transformArgs: {
                    position: Vector3.create(0, 0, 0),
                    rotation: Quaternion.Identity(),
                    scale: Vector3.create(0.32, 0.29, 0.32)
                }
            },
            mesh: "models/npc/npc_jones.glb"
        },
```