# IVariable interface

The `IVariable` interface represents a variable in the game.

Here is the definition of the `IVariable` interface:

```typescript
interface IVariable {
    name: string,
    type: "number" | "boolean",
    value: number | boolean
}
```

## Understanding variables in dcl-novel-engine

Variables are used to store data in the game. They can be of two types: `number` or `boolean`. Variable should be created in Articy and then used in the game. They are distributed in namespaces and loaded independent from packages. This is the sample code exported from Articy:

```json
{
    "Namespace": "MyNamespace",
    "Description": "",
    "Variables": [
        {
            "Variable": "coins",
            "Type": "Integer",
            "Value": "5",
            "Description": ""
        }
    ]
},
```

This variable can be accessed in the frame action scripts like this:

```typescript
MyNamespace.coins += 10;
```

And in the scene code, it can be accessed like this:

```typescript
let variable = novelEngine.getVariable("MyNamespace.coins");
let variableValue = variable.value;
```

## Properties

### `name`

The name of the variable.

### `type`

The type of the variable. It can be either `number` or `boolean`.

### `value`

The value of the variable. It can be either a number or a boolean.

## Related interfaces

- [IVariableNamespace](./i-variable-namespace.md)