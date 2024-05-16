# useBoolean

Hook provides a boolean state and a function to toggle the boolean value

```typescript
import { useBoolean } from '@sibericancode/reactuse';
```

## Usage
```typescript
const [on, toggle] = useBoolean()
```

## Api

### Parameters

| Name          | Type    | Default | Note                                          |
|---------------|---------|---------|-----------------------------------------------|
| initialValue? | boolean | false   | The initial boolean value, defaults to false. |

### Returns

[`UseBooleanReturn`](#usebooleanreturn)

## Type aliases

### UseBooleanReturn

Type: `Object`
Description: The use boolean return type

#### Type declaration

| Name   | Type                      | Note                                  |
|--------|---------------------------|---------------------------------------|
| on     | boolean                   | The current boolean state value.      |
| toggle | (value?: boolean) => void | Function to toggle the boolean state. |

## Contributors

[Source](#) • [Docs](#)

[Suggest changes to this page](#)