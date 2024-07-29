# SoundController class

The `SoundController` class is a controller that manages sound entities in the novel.

Using the `SoundController` class, you can play three types of sounds:

- Music (for example, background music)
- Sound effects (for example, footsteps)
- Character typing sounds (used by UI Controller)

Here is the description of these sound types:

## Music

Music is a sound that plays in the background. The `SoundController` class can play only one music sound at a time. That is, if you play a new music sound, the previous music sound stops.

To play a music sound, use the `playMusicSound(filepath: string, loop: boolean, source: Vector3)` method:

```typescript
soundController.playMusicSound("music/main.mp3", true, new Vector3(0, 0, 0));
```

### Parameters

- `filepath`: The path to the music file.
- `loop`: A boolean value that indicates whether the music sound should loop.
- `source`: The position of the sound source.

> Note: `playMusicSound()` method returns a new entity that is used later for playing the music. You can use it to move the sound source or stop the music using `stopMusicSound(entity: Entity)` method.

You can also change the volume of the music sound using the `setMusicVolume(volume: number)` method. The `volume` parameter is a number between 0 and 1.

> Note: Calling `setMusicVolume()` method will stop existing music sound and play it from the beginning with the new volume. This is a limitation of the Decentraland SDK.

## Sound effects

Sound effects are short sounds that play in the scene. The `SoundController` class can play multiple sound effects at the same time. They are very simular to music sounds, but they can overlap. It means that you can play multiple sound effects at the same time without stopping the previous ones.

> Note: it is not obligatory to remove entities of sound effects. They will be removed automatically by the controller.

Usage is the same as for music sounds:

```typescript
soundController.playSoundEffect("sound/footsteps.mp3", false, new Vector3(0, 0, 0)); // Play sound effect
soundController.setSoundVolume(0.5); // Set volume
```

## Character typing sounds

Character typing sounds are short sounds that play when a character types text. They are not supposed to be played manually, instead, they are played by the UI Controller when a character speaks. But in general, they are similar to sound effects.

You can use methods of character typing sounds to change the volume of the sound in your custom settings menu.

Usage is the same as for sound effects, except that there are no `loop` parameter:

```typescript
soundController.playSpeechSound("sound/typing.mp3", new Vector3(0, 0, 0)); // Play character typing sound
soundController.setSpeechVolume(0.5); // Set volume
```