# Getting started with dcl-novel-engine

In this page, we will cover the initialization of the engine and importing json files and assets, exported from Articy X software.

## Table of contents

- [Creating Articy project](#creating-articy-project)
- [Exporting from Articy](#exporting-from-articy)
- [Preparing project](#preparing-project)
- [Engine initialization](#engine-initialization)
  - [Creating a new instance of the engine](#creating-a-new-instance-of-the-engine)
  - [Loading packages from the manifest file](#loading-packages-from-the-manifest-file)
  - [Starting the novel](#starting-the-novel)
- [Conclusion](#conclusion)
- [What to read next?](#what-to-read-next)

## Creating Articy Project

In order for your novel to gain all its depth and colorfulness, you must first describe it in an **Articy**. Articy is a tool for rapid prototyping scenarios with the ability to place branches, characters, game resources, and more.

[Following this tutorial](docs/articy-docs.md), you will be able to create the main part of your novel without even resorting to programming!

## Exporting from Articy

Use [this article](docs/articy-docs.md#exporting-a-project-from-articy) to learn how to manipulate and export the logic of your game scenarios from Articy


## Preparing project

First, clone [the template repository](https://github.com/dapp-craft/decentraland-novel-template) and install the dependencies.

```bash
git clone <link>
cd dcl-novel-game-template
npm i
```

Now you need to copy all the exported JSON files from Articy to the `src/input` folder and the assets to the `Assets` folder.

## Engine initialization

### Creating a new instance of the engine

To initialize the engine, you need to create a new instance of the `Engine` class. This class is the main entry point for the engine and it will handle all the logic and data of the novel.

```typescript
import Engine from './dcl-novel-engine/engine/engine'

const novelEngine = new Engine("src/input/manifest.json") // Manifest file exported from Articy
```

### Loading packages from the manifest file

At this moment, the engine is instantiated, but it is not yet ready to play the novel. We need to load packages we want to use in the novel. Names of the packages are defined in the manifest file, below is an example of `Packages` section of the manifest file:

```json
...
"Packages": [
    {
      "Name": "Chapter_1",
      "Id": "0x010000000001E7C5",
      "Description": "",
      "IsDefaultPackage": false,
      "IsIncluded": true,
      "ScriptFragmentHash": "iPDPDjzX+sGkiPe6pnA8EMFWOYobW1dcJeMHJrbHwZg=",
      "Files": {
        "Objects": {
          "FileName": "package_010000000001E7C5_objects.json",
          "Hash": "CGkyAF/+RoJwCos1LDI+afeRGVVLMR3/R3q99LHf2VU="
        },
        "Texts": {
          "FileName": "package_010000000001E7C5_localization.json",
          "Hash": "2zv45mZtR9cmm1yh+q1MTm2S0emkD8lkJOr/o54Fd9Q="
        }
      }
    },
    {
      "Name": "Chapter_2",
      "Id": "0x010000000001E7C7",
      "Description": "",
      "IsDefaultPackage": false,
      "IsIncluded": true,
      "ScriptFragmentHash": "+hTEXqFRrngGpa7Vq79Wb+07kDXu59bbnABku+ySad0=",
      "Files": {
        "Objects": {
          "FileName": "package_010000000001E7C7_objects.json",
          "Hash": "tyErrqa9DfuVlcNxyjcL77XNlpwxG/PBqLplweZQsbg="
        },
        "Texts": {
          "FileName": "package_010000000001E7C7_localization.json",
          "Hash": "7lU4fuA1dCX3ykGEj3KF52V3bmPA81KBDd7HtHYqmCY="
        }
      }
    },
    ...
],
...
```

Here we can see all the packages that are exported from Articy. To load a package, we need to call the `loadPackage` method of the engine instance:

```typescript
novelEngine.addPackage("Chapter_1")
```

> Note: `addPackage()` method is asynchronous, so you need to wait for it to finish before you can start the novel.

```typescript
await novelEngine.addPackage("Chapter_1")
```

The main goal of such methodology of loading packages is to allow the engine to load only the necessary data, and not to load all the data at once. Sometimes the novel can be very large and loading all the data at once can be very slow. So, you can handle the loading of packages in the way you want.

> Note: When the package is loaded, the engine will upsert it to the existing data. Be sure there are no duplicate objects in the packages.

### Starting the novel

After all the packages are loaded, you can start the novel by calling the `showFrame()` method of the engine instance. But before that, you need to obtain the first frame of the sequence you want to start from. In general, you can call this method at any moment to show any frame you want. Below is an example of how to start the novel from the first frame of the first sequence of the package `Chapter_1`:

```typescript
const firstSequence = novelEngine.getFirstSequenceOfPackage("Chapter_1")
novelEngine.showFrame(firstSequence.firstFrame)
```

After all the steps above, you should have a working novel engine that is ready to play the novel.

## Conclusion

In this page, we covered the initialization of the engine and importing json files and assets, exported from Articy X software. Now you can start creating your own novel using the dcl-novel-engine.

## What to read next?

- [Articy documentation: comprehensive guide about building your own novel in Articy](docs/articy-docs.md)
- [Handling custom nodes: how to create and use custom nodes in the engine](docs/custom-nodes.md)
- [Additional features of engine.ts](docs/engine-ts-features.md)
- [Engine objects](docs/engine-objects/README.md)