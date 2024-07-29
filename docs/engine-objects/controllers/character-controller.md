# CharacterController Class

The `CharacterController` class is responsible for managing the characters in the application. It provides methods to manipulate character properties and handle character interactions.

## Public Properties

### `characterList: Character[]`

This property is an array of `Character` objects, representing all the characters currently in the scene.

### `activeCharacter: Character`

This property represents the character that is currently active or being controlled by the user.

## Public Methods

### `addCharacter(character: Character): void`

This method is used to add a new character to the `characterList`.

### `removeCharacter(character: Character): void`

This method is used to remove a character from the `characterList`.

### `setActiveCharacter(character: Character): void`

This method is used to set the `activeCharacter`. The character passed as a parameter becomes the new active character.

### `getActiveCharacter(): Character`

This method is used to get the `activeCharacter`.

### `moveCharacter(character: Character, position: Vector3): void`

This method is used to move a character to a new position. The character and the new position are passed as parameters.

# Templates
Use [CharacterTemplate](../interfaces/i-character-template.md) to controll the position, animations, and other properties of the character. Define the character templates and add to engine, to manipulate with NPC automatically.
