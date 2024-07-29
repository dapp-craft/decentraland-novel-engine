# UIController Class

The `UIController` class is responsible for managing the user interface in the application. It provides methods to manipulate UI elements and handle user interactions.

## Public Properties

### `visible: boolean`

This property indicates whether the UIController is visible or not.

### `overlayController: OverlayController`

This property is an instance of the `OverlayController` class, which is used to manage overlays in the UI.

### `stopTextAnimation: boolean`

This property is used to control whether text animations should be stopped or not.

### `markedFrames: MarkedFrame[]`

This property is an array of `MarkedFrame` objects, representing frames that have been marked in the UI.

### `buttonConfig: ButtonConfig`

This property is an instance of the `ButtonConfig` class, which is used to configure buttons in the UI.

### `nextButton: Button`

This property represents the "Next" button in the UI.

## Public Methods

### `setSequences(sequences: Sequence[]): void`

This method is used to set the sequences for the UIController.

### `onPreLoadFrame(frame: Frame): void`

This method is called when a frame is preloaded. It can be used to perform any actions you need to do when a frame is loaded.

### `onPostLoadFrame(frame: Frame): void`

This method is called after a frame is loaded. It can be used to perform any actions you need to do after a frame is loaded.

### `isMarked(text: string): boolean`

This method checks if a given text is marked or not.

### `forgetAllMarkables(): void`

This method is used to forget all markables in the UI.

### `rememberButtonMark(text: string): void`

This method is used to remember a button mark in the UI.

# Templates
Use [ButtonTemplate](../interfaces/i-button-template.md) to controll the view of used buttons. Define the button templates and add to engine, to manipulate with buttons automatically.