# Memoization

## Library Philosophy

ReactUse **deliberately avoids memoizing** hook methods by default. This decision is based on several important principles of React application development.

## About optimization

> "Premature optimization is the root of all evil" — Donald Knuth

Memoization is an optimization technique, and like any optimization, it should be applied consciously when there's a real performance problem. Automatic memoization of all functions can:

- **Hide real architectural problems** — instead of fixing the root cause of unnecessary re-renders, we mask the symptoms
- **Create a false sense of security** — developers might think performance is already optimized
- **Complicate debugging** — memoized functions don't behave as expected when dependencies change

## Re-renders are normal

React is designed so that component re-renders are a natural and efficient part of its operation. Modern browsers and React Fiber can handle a lot of re-renders without noticeable impact on performance.

Memoization is a tool that should be in the hands of the application developer, not the library.

```tsx
import { useCounter } from '@siberiacancode/reactuse';
import { useCallback, useMemo } from 'react';

function ExpensiveComponent() {
  const counter = useCounter(0);

  const expensiveValue = useMemo(() => {
    return performHeavyCalculation(counter.value);
  }, [counter.value]);

  const handleIncrement = useCallback(() => {
    performHeavyOperation();
    counter.inc();
  }, [counter.inc]);

  // ...
}
```

## React compiler

The React team is working on **React Compiler** — a tool that will automatically optimize your code by adding memoization where it's truly needed.

When React Compiler becomes stable, the question of manual memoization will become less relevant, but the principles of conscious optimization will remain important.
