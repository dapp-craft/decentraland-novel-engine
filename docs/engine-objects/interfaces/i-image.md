# IAudioAsset interface

The `IImageAsset` interface represents an audio asset in the scene.

Here is the definition of the `IImageAsset` interface:

```typescript
interface IImageAsset {
    id: string;
    technicalName: string;
    displayName: string;
    filePath: string;
}
```

## Properties

### `id`

The unique identifier of the image asset. For example, `0x010000000000BA47`.

### `technicalName`

The technical name of the image asset from Articy. For example, `DFr_7F88E65E`.

### `displayName`

The display name of the image asset.

### `filePath`

The path to the image file.
