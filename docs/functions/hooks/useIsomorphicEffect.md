<script setup>
import Demo from '../../components/demo.vue'
</script>

# useIsomorphicEffect

Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment

```typescript
import { useIsomorphicEffect } from '@sibericancode/reactuse';
```

## Usage
```typescript
useIsomorphicEffect(callback, deps)
```

## Demo

<Demo hook="useIsomorphicEffect" />


## Contributors

[Source](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useIsomorphicEffect/useIsomorphicEffect.ts) • [Demo](https://github.com/siberiacancode/reactuse/blob/main/src/hooks/useIsomorphicEffect/useIsomorphicEffect.demo.ts) • [Docs](#)

[Suggest changes to this page](#)