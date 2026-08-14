---
title: useIsomorphicLayoutEffect
description: Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
category: lifecycle
usage: high
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useIsomorphicLayoutEffect

Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment

## Demo

```tsx
import { useIsomorphicLayoutEffect } from '@siberiacancode/reactuse';

const Demo = () => {
  useIsomorphicLayoutEffect(() => {
    console.log(`log: useLayoutEffect`);
  }, []);

  return (
    <div>
      I am <b>useLayoutEffect</b>
    </div>
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
npx useverse@latest add useIsomorphicLayoutEffect
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useLayoutEffect } from 'react';

/**
 * @name useIsomorphicLayoutEffect
 * @description - Hook conditionally selects either `useLayoutEffect` or `useEffect` based on the environment
 * @category Lifecycle
 * @usage high
 *
 * @example
 * useIsomorphicLayoutEffect(() => console.log('effect'), [])
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

Update the import paths to match your project setup.

## Usage

```tsx
useIsomorphicLayoutEffect(() => console.log('effect'), [])
```