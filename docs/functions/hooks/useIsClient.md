<script setup>
import Demo from '../../components/demo.vue'
</script>

# useIsClient

Hook provides a boolean state and a function to toggle the boolean value

```typescript
import { useIsClient } from '@sibericancode/reactuse';
```

## Usage
```typescript
const isClient = useIsClient()
```

## Demo

<Demo hook="useIsClient" />

### Returns

[`UseIsClientReturn`](#useisclientreturn)

## Type aliases

### UseIsClientReturn

Type: `Boolean`
Description: Boolean identifier whether your code is running on client side or on server

#### Type declaration

| Name     | Type                      | Note                                  |
|----------|---------------------------|---------------------------------------|
| isClient | boolean                   | Identifier whether your code is running on client side or on server      |

## Contributors

[Source](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useBoolean/useBoolean.ts) • [Demo](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useBoolean/useBoolean.demo.ts) • [Docs](#)

[Suggest changes to this page](#)
