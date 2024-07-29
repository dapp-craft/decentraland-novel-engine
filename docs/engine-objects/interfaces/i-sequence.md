# ISequence interface

The `ISequence` interface represents a sequence in the scene. It is used to group frames together and form dialogues, cutscenes, or any other sequence of events.

Here is the definition of the `ISequence` interface:

```typescript
interface ISequence {
    id: string;
    technicalName: string;
    displayName: string;
    targetSequence: string;
    frames: IFrame[];
    conditions: ICondition[];
    themeSong: IAudioAsset | undefined;
    themeBackground: IImageAsset | undefined;
    chapter: string;
    firstFrame: string;
}
```

## Properties

### `id`

The unique identifier of the sequence. For example, `0x010000000000BA47`.

### `technicalName`

The technical name of the sequence from Articy. For example, `DFr_7F88E65E`.

### `displayName`

The display name of the sequence.

### `targetSequence`

The unique identifier of the target sequence. This is used to navigate to another sequence when the current sequence ends.

### `frames`

An array of frames that belong to the sequence. To learn more about the `IFrame` interface, see [IFrame interface](./i-frame.md) page.

### `conditions`

An array of conditions that belong to the sequence. Each condition is an instance of the `ICondition` interface. To learn more about the `ICondition` interface, see [ICondition interface](./i-condition.md) page.

### `themeSong`

The sound asset to play as the theme song of the sequence. To learn more about the `IAudioAsset` interface, see [IAudioAsset interface](./i-audio.md) page.

### `themeBackground`

The image asset to display as the background of the sequence. To learn more about the `IImageAsset` interface, see [IImageAsset interface](./i-image.md) page.

### `chapter`

The package name sequence belongs to.

### `firstFrame`

The unique identifier of the first frame of the sequence. (First frame is not always have index 0, so it is better to use this property to get the first frame of the sequence.)

## Related interfaces

- [IFrame](./i-frame.md)
- [ICondition](./i-condition.md)
- [IAudioAsset](./i-audio.md)
- [IImageAsset](./i-image.md)
