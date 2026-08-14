---
title: useValidatedState
description: Hook that manages a state value together with its validation result
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782393128000
---

# useValidatedState

Hook that manages a state value together with its validation result

## Demo

```tsx
import { useValidatedState } from '@siberiacancode/reactuse';
import { Mail } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const Demo = () => {
  const [email, setEmail] = useValidatedState('hello@reactuse.org', (value) =>
    EMAIL_PATTERN.test(value)
  );

  return (
    <section className='flex max-w-sm flex-col gap-3'>
      <label className='text-sm font-medium' htmlFor='email'>
        Email
      </label>

      <div className='relative'>
        <Mail className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <input
          autoCapitalize='none'
          autoComplete='email'
          className='!pl-9'
          id='email'
          placeholder='you@example.com'
          spellCheck={false}
          type='email'
          value={email.value}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <span className='text-destructive h-4 text-xs'>
        {!email.valid && 'Enter a valid email address'}
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
npx useverse@latest add useValidatedState
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

/** The use validated state value type */
export interface UseValidatedStateValue<Value> {
  /** Last valid value */
  lastValidValue?: Value;
  /** True if the current value is valid, false otherwise */
  valid: boolean;
  /** Current value */
  value: Value;
}

/** The use validated state return type */
export type UseValidatedStateReturn<Value> = [
  state: UseValidatedStateValue<Value>,
  setValue: (value: Value) => void
];

/**
 * @name useValidatedState
 * @description - Hook that manages a state value together with its validation result
 * @category State
 * @usage medium
 *
 * @template Value The type of the state value
 * @param {Value} initialValue The initial state value
 * @param {(value: Value) => boolean} validate Function that validates the state value
 * @param {boolean} [initialValidationState] Optional initial validity state
 * @returns {UseValidatedStateReturn<Value>} A tuple containing the current state object and setter function
 *
 * @example
 * const [{ value, lastValidValue, valid }, setValue] = useValidatedState(
 *   '',
 *   (value) => value.length >= 3
 * );
 */
export const useValidatedState = <Value>(
  initialValue: Value,
  validate: (value: Value) => boolean,
  initialValidationState?: boolean
): UseValidatedStateReturn<Value> => {
  const [state, setState] = useState<UseValidatedStateValue<Value>>(() => {
    const isValid = validate(initialValue);
    return {
      value: initialValue,
      lastValidValue: isValid ? initialValue : undefined,
      valid: typeof initialValidationState === 'boolean' ? initialValidationState : isValid
    };
  });

  const setValidatedValue = (value: Value) => {
    setState((previousState) => {
      const isValid = validate(value);

      return {
        value,
        valid: isValid,
        lastValidValue: isValid ? value : previousState.lastValidValue
      };
    });
  };

  return [state, setValidatedValue];
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const [{ value, lastValidValue, valid }, setValue] = useValidatedState( '', (value) => value.length >= 3 );
```

## Type Declarations

```tsx
export interface UseValidatedStateValue<Value> {
  /** Last valid value */
  lastValidValue?: Value;
  /** True if the current value is valid, false otherwise */
  valid: boolean;
  /** Current value */
  value: Value;
}

export type UseValidatedStateReturn<Value> = [
  state: UseValidatedStateValue<Value>,
  setValue: (value: Value) => void
];
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `Value` | - | The initial state value |
| validate | `(value: Value) => boolean` | - | Function that validates the state value |
| initialValidationState | `boolean` | - | Optional initial validity state |

### Returns

`UseValidatedStateReturn<Value>` - A tuple containing the current state object and setter function