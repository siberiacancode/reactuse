---
title: useRerender
description: Hook that defines the logic to force rerender a component
category: debug
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useRerender

Hook that defines the logic to force rerender a component

## Demo

```tsx
import { useRerender } from '@siberiacancode/reactuse';

const Demo = () => {
  const rerender = useRerender();
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });

  return (
    <section className='flex flex-col items-center gap-4 p-8'>
      <span className='text-foreground font-mono text-5xl font-bold tabular-nums'>{time}</span>

      <button data-variant='outline' type='button' onClick={rerender}>
        Refresh
      </button>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useRerender
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useReducer } from 'react';

/** The use rerender return type */
type UseRerenderReturn = () => void;

/**
 * @name useRerender
 * @description - Hook that defines the logic to force rerender a component
 * @category Debug
 * @usage medium
 *
 * @returns {UseRerenderReturn} The rerender function
 *
 * @example
 * const rerender = useRerender();
 */
export const useRerender = (): UseRerenderReturn => useReducer(() => ({}), {})[1];
```

Update the import paths to match your project setup.

## Usage

```tsx
const rerender = useRerender();
```

## Type Declarations

```tsx
type UseRerenderReturn = () => void;
```

## API

### Returns

`UseRerenderReturn` - The rerender function