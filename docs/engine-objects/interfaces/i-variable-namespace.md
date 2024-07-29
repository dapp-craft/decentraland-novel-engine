# IVariableNamespace interface

The `IVariableNamespace` interface represents a namespace for variables in the game.

Here is the definition of the `IVariableNamespace` interface:

```typescript
interface IVariableNamespace {
    namespace: string,
    variables: IVariable[]
}
```

## Properties

### `namespace`

The name of the namespace.

### `variables`

An array of variables in the namespace.

## Related interfaces

- [IVariable](./i-variable.md)