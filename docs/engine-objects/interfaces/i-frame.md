# IFrame interface

The `IFrame` interface represents a frame in the scene.

Here is the definition of the `IFrame` interface:

```typescript
interface IFrame {
    id: string;
    technicalName: string;
    parentSequence: string;
    text: string;
    speaker: string;
    buttons: IButton[];
    characters: IFrameCharacter[];
    parameters: IFrameParameters;
    action: string | undefined;
    inputCondition: string | undefined; 
    menuText: string | undefined;
}
```

## Properties

### `id`

The unique identifier of the frame. For example, `0x010000000000BA47`.

### `technicalName`

The technical name of the frame from Articy. For example, `DFr_7F88E65E`.

### `parentSequence`

The unique identifier of the parent sequence of the frame.

### `text`

The text content of the frame.

### `speaker`

The unnique identifier of the speaker entity in the frame.

### `buttons`

An array of buttons in the frame. Each button is an instance of the `IButton` interface. To learn more about the `IButton` interface, see [IButton interface](./i-button.md) page.

### `characters`

An array of characters in the frame. Each character is an instance of the `IFrameCharacter` interface. To learn more about the `IFrameCharacter` interface, see [ICharacter interface](./i-frame-character.md) page.

### `parameters`

Additional parameters of the frame. Each parameter is an instance of the `IFrameParameters` interface. To learn more about the `IFrameParameters` interface, see [IFrameParameters interface](./i-frame-parameters.md) page.

### `action`

The action to perform when the frame is displayed. Action is a JavaScript code that can be executed in the context of the engine. It us typically used to change game variables.

### `inputCondition`

The condition to display the frame. The condition is a JavaScript code that can be executed in the context of the engine. If the condition returns `true`, the frame can be displayed. If the condition returns `false`, any button leading to the frame will be hidden and frame will not be able to visit.

### `menuText`

// TODO: Add description

## Related interfaces

- [IButton](./i-button.md)
- [ICharacter](./i-character.md)
- [IFrameParameters](./i-frame-parameters.md)