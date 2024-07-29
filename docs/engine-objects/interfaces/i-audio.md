# IAudioAsset interface

The `IAudioAsset` interface represents an audio asset in the scene.

Here is the definition of the `IAudioAsset` interface:

```typescript
interface IAudioAsset {
    id: string;
    technicalName: string;
    displayName: string;
    filePath: string;
}
```

## Properties

### `id`

The unique identifier of the audio asset. For example, `0x010000000000BA47`.

### `technicalName`

The technical name of the audio asset from Articy. For example, `DFr_7F88E65E`.

### `displayName`

The display name of the audio asset.

### `filePath`

The path to the audio file.