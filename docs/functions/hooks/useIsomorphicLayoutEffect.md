<script setup>
import Demo from '../../components/demo.vue'
</script>

# useIsomorphicLayoutEffect

Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment

```typescript
import { useIsomorphicLayoutEffect } from '@sibericancode/reactuse';
```

## Usage
```typescript
useIsomorphicLayoutEffect(callback, deps)
```

## Demo

<Demo hook="useIsomorphicLayoutEffect" />


## Contributors

[Source](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useIsomorphicLayoutEffect/useIsomorphicLayoutEffect.ts) • [Demo](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useIsomorphicLayoutEffect/useIsomorphicLayoutEffect.demo.ts) • [Docs](#)

[Suggest changes to this page](#)