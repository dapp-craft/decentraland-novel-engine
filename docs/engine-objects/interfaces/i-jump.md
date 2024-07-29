# IJump interface

The `IJump` interface represents a jump in the sequence. It is used to act like a hyperlink to another frame.

Here is the definition of the `IJump` interface:

```typescript
interface IJump {
    id: string;
    destination: string;
}
```

## Properties

### `id`

The unique identifier of the jump. For example, `0x010000000000BA47`.

### `destination`

The unique identifier of the frame to jump to.

## Related interfaces

- [IFrame](./i-frame.md)