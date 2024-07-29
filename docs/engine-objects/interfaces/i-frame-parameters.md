# IFrameParameters Interface

The `IFrameParameters` interface represents the parameters for a frame in the application.

Here is the definition of the `IFrameParameters` interface:

```typescript
interface IFrameParameters {
    typeNode: NodeType,
    autoScrollingTimer: number | undefined,
    soundEffect: IAudioAsset | undefined,
    sceneOverlay: IImageAsset | undefined,
    bubbleSpeech: BubbleSpeech,
    speedSpeech: number,
    shakeCameraIntensity: number,
    moveCamera: number,
    hpButtonName: string,
    showHpButton: boolean,
    sceneBackground: IImageAsset | undefined,
    title: string | undefined,
}
```

## Properties

### `typeNode`

The type of the node.

```typescript
enum NodeType {
    Dialog = 1,
    Service = 2,
    Cutscene = 3
}
```

Here are the possible values for the `typeNode` property:

- `Dialog`: Represents a dialog node. It is the default frame type and is used to display character dialogues.
- `Service`: Represents a service node. It is used to do service operations.
- `Cutscene`: Represents a cutscene node. It is used to play cutscenes without user input.

### `autoScrollingTimer`

The time in milliseconds to wait before auto-complete the frame.

### `soundEffect`

The sound effect to play when the frame is displayed. To learn more about the `IAudioAsset` interface, see [IAudioAsset interface](./i-audio.md) page.

### `sceneOverlay`

The image asset to overlay on the scene. To learn more about the `IImageAsset` interface, see [IImageAsset interface](./i-image.md) page.

### `bubbleSpeech`

// TODO: reconsider this property

### `speedSpeech`

The speed of the speech.

### `shakeCameraIntensity`

The intensity of the camera shake.

### `moveCamera`

The camera movement.

### `hpButtonName`

The name of the HP button.

### `showHpButton`

A boolean value indicating whether to show the HP button.

### `sceneBackground`

The image asset to use as the scene background. To learn more about the `IImageAsset` interface, see [IImageAsset interface](./i-image.md) page.

### `title`

The title of the frame.

## Related interfaces

- [IAudioAsset](./i-audio.md)
- [IImageAsset](./i-image.md)
- [IFrame](./i-frame.md)