# Additional features of engine.ts

In this page, we will cover additional features of the engine.ts file to help you create custom experiences in your novel.

## Hooks

Hooks are a way to extend the engine's functionality. They allow you to run custom code at specific points in the engine's lifecycle. The engine provides several hooks that you can use to customize the behavior of the engine. Below is a list of hooks that the engine provides:

- `preLoadFrameHook`: This hook is called before the engine loads the next frame. It receives two parameters: the previous node and the next node. You can use this hook to manipulate the engine before it loads the next frame. If you return `false` from this hook, the engine will stop loading the next frame.
- `postLoadFrameHook`: This hook is called after the engine loads the next frame. It receives two parameters: the previous node and the next node. You can use this hook to manipulate the engine after it loads the next frame.
- `onNodeParsedHook`: This hook is called after the engine parses a node from the JSON data. It receives two parameters: the parsed node data and the package id. You can use this hook to save custom nodes during the parsing process.

You can read more about hooks in the [Handling custom nodes](custom-nodes.md) page.

## Frame manipulation

The engine provides several methods to manipulate frames and get info about them. Below is a list of methods that the engine provides to manipulate frames:

- `showFrame(id: string)`: This method shows the frame with the specified id if it exists. In general, you can provide the id of sequence, condition, jump or some other node instead of frame and the engine will try to find the frame to show using built-in routing mechanisms and custom user-defined load hooks.
- `showFirstFrame()`: This method shows the first frame of the first loaded sequence.
- `getPreviousFrame()`: This method returns the previous frame that was shown.
- `addPreLoadFrameHook(hook: (previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => boolean)`: This method adds a pre-load frame hook to the engine. To read more about hooks, see the [Handling custom nodes with dcl-novel-engine](custom-nodes.md) page.
- `addPostLoadFrameHook(hook: (previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => void)`: This method adds a post-load frame hook to the engine. To read more about hooks, see the [Handling custom nodes with dcl-novel-engine](custom-nodes.md) page.
- `addNodeParsedHook(hook: (node: IHookNode, packageId: string) => void)`: This method adds a node parsed hook to the engine. To read more about hooks, see the [Handling custom nodes with dcl-novel-engine](custom-nodes.md) page.
- `addPackage(packageName: string)`: This method adds a package to the engine. To read more about packages, see the [Getting started with dcl-novel-engine](getting-started.md) page.
- `isPackageLoaded(packageName: string)`: This method checks if the package with the specified name is loaded.
- `getFirstSequenceOfPackage(packageName: string)`: This method returns the first sequence of the package with the specified name. To read more about sequences, see the [ISequence interface](./engine-objects/interfaces/i-sequence.md) page.
- `getFrameById(id: string)`: This method returns the frame with the specified id if it exists. To read more about frames, see the [IFrame interface](./engine-objects/interfaces/i-frame.md) page.
- `getSequenceById(id: string)`: This method returns the sequence with the specified id if it exists. To read more about sequences, see the [ISequence interface](./engine-objects/interfaces/i-sequence.md) page.
- `getCharacterById(id: string)`: This method returns the character with the specified id if it exists. To read more about characters, see the [ICharacter interface](./engine-objects/interfaces/i-character.md) page.
- `getSequences()`: This method returns all loaded sequences. To read more about sequences, see the [ISequence interface](./engine-objects/interfaces/i-sequence.md) page.
- `getVariables()`: This method returns all loaded variables. To read more about variables, see the [IVariable interface](./engine-objects/interfaces/i-variable.md) page.