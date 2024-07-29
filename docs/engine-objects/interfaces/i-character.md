# ICharacter interface

The `ICharacter` interface represents a character in the frame.

Here is the definition of the `ICharacter` interface:

```typescript
interface ICharacter {
    id: string;
    technicalName: string;
    shortId: number;
    displayName: string;
    asset: string;
    textSound: IAudioAsset | undefined;
}
```

## Properties

### `id`

The unique identifier of the character. For example, `0x010000000000BA47`.

### `technicalName`

The technical name of the character from Articy. For example, `DFr_7F88E65E`.

### `shortId`

The short identifier of the character.

### `displayName`

The display name of the character.

### `asset`

The unique identifier of the asset of the character. For example, `0x010000000000BA47`.

### `textSound`

The sound asset to play when the character speaks. To learn more about the `IAudioAsset` interface, see [IAudioAsset interface](./i-audio.md) page.

## Related interfaces

- [IAudioAsset](./i-audio.md)
- [IFrame](./i-frame.md)