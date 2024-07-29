# IButton interface

The `IButton` interface represents a button in the frame.

Here is the definition of the `IButton` interface:

```typescript
interface IButton {
    text: string;
    targetFrame: string;
} 
```

## Properties

### `text`

The text content of the button.

### `targetFrame`

Unique identifier of the frame to navigate to when the button is clicked.

## Related interfaces

- [IFrame](./i-frame.md)