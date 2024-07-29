# IButtonTemplate Interface

The `IButtonTemplate` interface represents the template for a button object in the DCL Novel Engine.

## Properties

### `id`

The unique identifier for the button. (string)

### `markable`

Indicates whether the button can be marked or not. (boolean)

### `ui` (optional)

An object that defines the UI properties for the button. It can have the following properties:

### `uiText` (optional)

An object that defines the UI label properties for the button.

### `hotKey` (optional)

An object that represents the hotkey action for the button.

## Example Usage

```typescript
{

    id: "Next",
    markable: false,
    ui: {
      uiTransform: {
        width: "70%",
        height: "70%",
        alignSelf: 'center',
        position: { left: "370%", bottom: "10%" },
        positionType: 'absolute'
      },
      uiBackground: {
        textureMode: 'stretch',
        texture: {
          src: Resources.ui.small_forward
        }
      }
    },
    hotKey: InputAction.IA_PRIMARY
  }, 
```
