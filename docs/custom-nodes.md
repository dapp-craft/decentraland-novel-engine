# Handling custom nodes with dcl-novel-engine

Sometimes, the default nodes provided by Articy are not enough to create the desired behavior in the novel. In this case, we can create custom nodes that will be used in the novel. This document will guide you through the process of creating and handling custom nodes in the dcl-novel-engine.

## Table of contents

- [Idea behind custom nodes in the engine](#idea-behind-custom-nodes-in-the-engine)
- [Using engine hooks to handle custom nodes](#using-engine-hooks-to-handle-custom-nodes)
  - [Frame pre- and post-load hooks overview](#frame-pre--and-post-load-hooks-overview)
  - [Parser hook overview](#parser-hook-overview)
- [Conclusion](#conclusion)

## Idea behind custom nodes in the engine

When we are loading a package, the engine will try to parse all the nodes in json files. It has several pre-defined nodes that it can handle, such as `Asset`, `Dialogue`, `DialogueFragment`, `Entity`, `Condition`, `Jump`. These names are are taken from the base Articy template. If the engine meets a node that does not belong to any of these types, it will be considered as a custom node and parsed as `IUnknownNode`:

```typescript
interface IUnknownNode {
    id: string,
    type: string,
    data: any
}
```

This interface is used to store the data of the custom node. The `data` field can be any type, as it is a generic field. The `type` field is used to identify the type of the node, so we can handle it properly in the engine.

## Using engine hooks to handle custom nodes

### Frame pre- and post-load hooks overview

The engine provides a way to handle custom(and also build-in) nodes by using frame load hooks. There are two types of hooks: `preLoadFrameHook` and `postLoadFrameHook`. The first one is called before **any node** is loaded, and the second one is called after **DialogueFragment** node os fully processed.

> Note: `preLoadFrameHook` will be called more often than `postLoadFrameHook`. Method `showFrame()` tries to find **DialogueFragment** node to show, but it can walk through other nodes before it finds the right one. For example, it can walk through **Condition** nodes to find the right **DialogueFragment**. Hook `postLoadFrameHook` will be called only when the right **DialogueFragment** is found.

To handle custom nodes, we need to add a `preLoadFrameHook` in our code. Here is an example of how to handle a custom node:

```typescript
novelEngine.addPreLoadFrameHook((previousNode: IHookNode | undefined, nextNode: IHookNode | undefined) => {
    console.log(previousNode); // previous frame
    console.log(nextNode); // next node (not always a frame)
    console.log(nextNode.type); // type of the next node, not base class!
    return true;
})
```

`preLoadFrameHook` must return a boolean value. If it returns `true`, the engine will continue to load the next node, using default behavior. If it returns `false`, the engine will stop loading the next node. This can be useful to redirect the engine or to wait for some data to be loaded.

We can use `showFrame()` method inside the hook to manipulate the engine. In this case, we need to return `false` to stop the engine from loading the next node itself.

### Parser hook overview

The engine also provides a way to save custom (or engine built-in) nodes during json parsing process. This is done by using `onNodeParsedHook`. This hook is called just after the node is parsed from json and is on the way to be cached in the engine. This hook is called for every node in the package.

When calling the hook, engine passes the parsed node data and package id to the hook. The package id is used to identify the package where the node is located. The parsed node data is an object of type `IHookNode`:

```typescript
interface IHookNode {
    id: string, // id of the node
    type: string, // type of the node
    data: any // json data of the node
}
```

To subscribe to this hook, we need to call `novelEngine.addOnNodeParsedHook()`. Here is an example of how to handle a custom node with type `myExampleNode`:

```typescript
interface IExampleNodeData {
    id: string,
    someField: string,
}

exampleNodesArray: IExampleNodeData[] = [];

novelEngine.addOnNodeParsedHook((node: IHookNode, packageId: string) => {
    if (node.type == "myExampleNode") {
        console.log(node.data); // data of the custom node
        console.log(packageId); // id of the package

        // save the node data
        exampleNodesArray.push({
            id: node.id,
            someField: node.data.someField
        });
    }
})
```

The code above will save all the nodes with type `myExampleNode` to the `exampleNodesArray` array. This array can be used later in the engine to handle the custom nodes.

## Conclusion

In this document, we have learned how to handle custom nodes in the dcl-novel-engine. We have seen how to use engine hooks to handle custom nodes and how to save custom nodes during the parsing process. This knowledge will help you to create more complex and interesting novels using the dcl-novel-engine.