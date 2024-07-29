# ICondition interface

The `ICondition` interface represents a condition in the frame.

Here is the definition of the `ICondition` interface:

```typescript
interface ICondition {
    id: string;
    technicalName: string;
    parentSequence: string;
    expression: string;
    trueFrame: string;
    falseFrame: string;
}
```

## Properties

### `id`

The unique identifier of the condition. For example, `0x010000000000BA47`.

### `technicalName`

The technical name of the condition from Articy. For example, `DFr_7F88E65E`.

### `parentSequence`

The unique identifier of the parent sequence of the condition.

### `expression`

The expression of the condition. The expression is a JavaScript code that can be executed in the context of the engine. It is used to evaluate the condition.

### `trueFrame`

The unique identifier of the frame to display if the condition is true.

### `falseFrame`

The unique identifier of the frame to display if the condition is false.

## Related interfaces

- [IFrame](./i-frame.md)