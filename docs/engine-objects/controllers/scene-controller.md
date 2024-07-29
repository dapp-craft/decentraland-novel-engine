# SceneController class

The `SceneController` class extends the `NovelController` abstract class. It provides the functionality to manage the scenes in a novel, including setting sequences, loading frames, and changing character emotions.

## Properties

### `_backgroundEntitiesDict: { [key: string]: Entity }`

A private dictionary that maps a string key to an `Entity`. It is used to store the background entities in the scene.

## Methods

### `setSequences(sequences: Sequence[])`

This method is used to set the sequences for the scene. It iterates over each sequence and each frame within the sequence to build the background entities if they do not exist in the `_backgroundEntitiesDict`.

### `onPreLoadFrame(frame: Frame)`

This method is called when a frame is preloaded. Currently, it does not perform any actions.

### `onPostLoadFrame(frame: Frame)`

This method is called after a frame is loaded. It performs several actions such as setting the scene background, shaking the camera, moving characters and the camera, playing sound effects, and changing character emotions based on the frame parameters.

### `changeEmotions(chars: IFrameCharacter[], frame: Frame)`

This method is used to change the emotions of the characters in the scene. It iterates over each character and sets the animation based on the character's animations and the frame parameters.

## Functions

### `buildBackground(path: string): Entity`

This function is used to build a background entity from a given path. It creates a new entity, sets its transform, and adds a `GltfContainer` to it with the given path.

### `updateSoundPosition()`

This function is used to update the sound position based on the music volume settings. It is added to the engine as a system.