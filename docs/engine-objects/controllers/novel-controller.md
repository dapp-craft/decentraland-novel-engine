# NovelController abstract class

The `NovelController` class is an abstract class that defines the interface for a novel controller with built-in simple hooks for loading new frame and loading sequences.

## Methods
### `onPreLoadFrame(frame: Frame)`

This method is called when the frame is loaded. You can use it to perform any actions you need to do when a frame is loaded.
### `onPostLoadFrame(frame: Frame)`

This method is called after the frame is loaded. You can use it to perform any actions you need to do after a frame is loaded.

### `setSequences(sequences: Sequence[])`

This method is called when the sequences are loaded. You can use information about all frames of your game to implement some logic.

> Note: For creating more advanced controllers and handling custom nodes, you can use methods of the `Engine` class from `engine.ts`. To read more about the `Engine` class, see the [Additional features of engine.ts](../../engine-ts-features.md) and [Handling custom nodes with dcl-novel-engine](../../custom-nodes.md) pages.