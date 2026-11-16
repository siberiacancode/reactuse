---
title: useRefState
description: Hook that returns the state reference of the value
category: state
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1766052966000
---

# useRefState

Hook that returns the state reference of the value

## Demo

```tsx
import { useRefState } from '@siberiacancode/reactuse';

const Demo = () => {
  const enabled = useRefState(false);

  return (
    <section className='flex flex-col items-center gap-3 p-8'>
      <input
        checked={enabled.current}
        role='switch'
        type='checkbox'
        onChange={() => (enabled.current = !enabled.current)}
      />

      <span className='text-muted-foreground text-sm'>
        {enabled.current ? 'Enabled' : 'Disabled'}
      </span>
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
npx useverse@latest add useRefState
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

export interface StateRef<Value> {
  (node: Value): void;
  current: Value;
  state?: Value;
}

export const createRefState = <Value>(
  initialValue: Value | undefined,
  setState: (value: Value) => void
) => {
  let temp = initialValue;
  function ref(value: Value) {
    if (temp === value) return;
    temp = value;
    setState(temp);
  }

  Object.defineProperty(ref, 'current', {
    get() {
      return temp;
    },
    set(value: Value) {
      if (temp === value) return;
      temp = value;
      setState(temp);
    },
    configurable: true,
    enumerable: true
  });

  return ref as StateRef<Value>;
};

/**
 * @name useRefState
 * @description - Hook that returns the state reference of the value
 * @category State
 * @usage low
 *
 * @template Value The type of the value
 * @param {Value} [initialValue] The initial value
 * @returns {StateRef<Value>} The current value
 *
 * @example
 * const internalRefState = useRefState();
 */
export const useRefState = <Value>(initialValue?: Value) => {
  const [state, setState] = useState<Value | undefined>(initialValue);
  const [ref] = useState(() => createRefState<Value>(initialValue, setState));
  ref.state = state;
  return ref;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const internalRefState = useRefState();
```

## Type Declarations

```tsx
export interface StateRef<Value> {
  (node: Value): void;
  current: Value;
  state?: Value;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `Value` | - | The initial value |

### Returns

`StateRef<Value>` - The current value