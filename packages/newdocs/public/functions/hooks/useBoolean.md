---
title: useBoolean
description: Hook provides opportunity to manage boolean state
category: state
usage: necessary
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781247117000
---

# useBoolean

Hook provides opportunity to manage boolean state

## Demo

```tsx
import { useBoolean } from '@siberiacancode/reactuse';
import { Eye, EyeOff } from 'lucide-react';

const Demo = () => {
  const [visible, toggle] = useBoolean();

  return (
    <section className='flex max-w-sm flex-col gap-3'>
      <label className='text-sm font-medium' htmlFor='password'>
        New password
      </label>

      <div className='relative'>
        <input
          className='pr-10'
          data-id='password'
          defaultValue='mysecretpassword'
          id='password'
          placeholder='Enter your password'
          type={visible ? 'text' : 'password'}
        />

        <button
          className='absolute top-1/2 right-0 -translate-y-1/2'
          data-variant='unstyled'
          type='button'
          onClick={() => toggle()}
        >
          {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </button>
      </div>
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
npx useverse@latest add useBoolean
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

/** The use boolean return type */
export type UseBooleanReturn = [
  /** The current boolean state value */
  value: boolean,
  /** Function to toggle the boolean state */
  toggle: (value?: boolean) => void
];

/**
 * @name useBoolean
 * @description - Hook provides opportunity to manage boolean state
 * @category State
 * @usage necessary

 * @param {boolean} [initialValue=false] The initial boolean value
 * @returns {UseBooleanReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const [on, toggle] = useBoolean()
 */
export const useBoolean = (initialValue = false): UseBooleanReturn => {
  const [value, setValue] = useState(initialValue);
  const toggle = (value?: boolean) => setValue((prevValue) => value ?? !prevValue);

  return [value, toggle] as const;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const [on, toggle] = useBoolean()
```

## Type Declarations

```tsx
export type UseBooleanReturn = [
  /** The current boolean state value */
  value: boolean,
  /** Function to toggle the boolean state */
  toggle: (value?: boolean) => void
];
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `boolean` | false | The initial boolean value |

### Returns

`UseBooleanReturn` - An object containing the boolean state value and utility functions to manipulate the state