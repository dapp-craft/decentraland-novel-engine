# IFrameCharacter interface

The `IFrameCharacter` interface represents a character in the frame.

Here is the definition of the `IFrameCharacter` interface:

```typescript
interface IFrameCharacter {
    characterShortId: number,
    animations: string,
    directionOfView: number,
    position: number
}
```

## Properties

### `characterShortId`

The short identifier of the character. It us used to match the character with the `shortId` property of the `ICharacter` interface. (See [ICharacter interface](./i-character.md))

### `animations`

The animations of the character.

### `directionOfView`

The direction of view of the character.

### `position`

The position of the character in the frame.

## Related interfaces

- [ICharacter](./i-character.md)
- [IFrame](./i-frame.md)
