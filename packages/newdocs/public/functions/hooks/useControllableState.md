---
title: useControllableState
description: Hook that manages both controlled and uncontrolled state patterns
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1757226836000
---

# useControllableState

Hook that manages both controlled and uncontrolled state patterns

## Demo

```tsx
import type { ComponentProps } from 'react';

import { useControllableState } from '@siberiacancode/reactuse';
import { useState } from 'react';

interface SwitchProps extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  initialValue?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch = ({ value, initialValue, onChange, ...props }: SwitchProps) => {
  const [checked, setChecked] = useControllableState({
    value,
    initialValue: initialValue ?? false,
    onChange
  });

  return (
    <input
      {...props}
      checked={checked ?? false}
      role='switch'
      type='checkbox'
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
};

interface Preferences {
  analytics: boolean;
  autoSave: boolean;
  darkMode: boolean;
  marketing: boolean;
  notifications: boolean;
}

const SETTINGS = [
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Get notified about important updates'
  },
  {
    key: 'darkMode',
    label: 'Dark mode',
    description: 'Use dark theme across the app'
  },
  {
    key: 'autoSave',
    label: 'Auto-save',
    description: 'Save changes automatically as you type'
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Help us improve by sharing usage data'
  },
  {
    key: 'marketing',
    label: 'Marketing emails',
    description: 'Receive product news and offers'
  }
] as const;

const ALL_OFF = {
  notifications: false,
  darkMode: false,
  autoSave: false,
  analytics: false,
  marketing: false
} as const;

const ALL_ON: Preferences = {
  notifications: true,
  darkMode: true,
  autoSave: true,
  analytics: true,
  marketing: true
};

const RECOMMENDED: Preferences = {
  notifications: true,
  darkMode: true,
  autoSave: true,
  analytics: true,
  marketing: false
};

const Demo = () => {
  const [preferences, setPreferences] = useState<Preferences>(ALL_OFF);

  return (
    <section className='flex w-full max-w-md min-w-0 flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h3>Preferences</h3>
        <p className='text-muted-foreground'>Manage how the app behaves.</p>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <button data-variant='outline' type='button' onClick={() => setPreferences(ALL_ON)}>
          All on
        </button>
        <button data-variant='outline' type='button' onClick={() => setPreferences(ALL_OFF)}>
          All off
        </button>
        <button data-variant='outline' type='button' onClick={() => setPreferences(RECOMMENDED)}>
          Recommended
        </button>
      </div>

      <div className='flex flex-col'>
        {SETTINGS.map((setting) => (
          <div key={setting.key} className='flex items-center justify-between gap-4 py-3'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <label htmlFor={setting.key}>{setting.label}</label>
              <p className='text-muted-foreground text-xs break-words'>{setting.description}</p>
            </div>

            <Switch
              id={setting.key}
              value={preferences[setting.key]}
              onChange={(value) =>
                setPreferences((current) => ({ ...current, [setting.key]: value }))
              }
            />
          </div>
        ))}

        <div className='border-border mt-2 border-t pt-2'>
          <div className='flex items-center justify-between gap-4 py-3'>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <label htmlFor='beta'>Beta features</label>
              <p className='text-muted-foreground text-xs'>
                Independent toggle - managed inside the component
              </p>
            </div>

            <Switch id='beta' initialValue={false} />
          </div>
        </div>
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
npx useverse@latest add useControllableState
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useCallback, useRef, useState } from 'react';

/** The use controllable state options type */
export interface UseControllableStateOptions<Value> {
  /** The initial value for uncontrolled state */
  initialValue?: Value;
  /** The controlled value */
  value?: Value;
  /** The onChange callback */
  onChange?: (value: Value) => void;
}

/** The use controllable state return type */
export type UseControllableStateReturn<Value> = [
  /** Current value */
  value: Value,
  /** Setter function that works with both controlled and uncontrolled state */
  setValue: (nextValue: ((prevValue: Value) => Value) | Value) => void,
  /** Whether the state is controlled */
  isControlled: boolean
];

/**
 * @name useControllableState
 * @description - Hook that manages both controlled and uncontrolled state patterns
 * @category State
 * @usage medium
 *
 * @template Value The type of the state value
 * @param {Value} [options.value] The controlled value. When provided, the component becomes controlled
 * @param {Value} [options.initialValue] The initial value for uncontrolled state
 * @param {(value: Value) => void} [options.onChange] The callback function called when the state changes
 * @returns {UseControllableStateReturn<Value>} A tuple containing the current value, setter function, and controlled flag
 *
 * @example
 * const [value, setValue, isControlled] = useControllableState({ initialValue: 'initial' });
 */
export function useControllableState<Value>(
  options: UseControllableStateOptions<Value>
): UseControllableStateReturn<Value> {
  const { value, initialValue, onChange } = options;
  const isControlled = value !== undefined;

  const [internalState, setInternalState] = useState<Value>(initialValue as Value);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const currentValue = isControlled ? value : internalState;

  const setValue = useCallback(
    (nextValue: ((prevValue: Value) => Value) | Value) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (prevValue: Value) => Value)(currentValue)
          : nextValue;

      if (!isControlled) setInternalState(resolvedValue);

      onChangeRef.current?.(resolvedValue);
    },
    [currentValue, isControlled]
  );

  return [currentValue, setValue, isControlled];
}
```

Update the import paths to match your project setup.

## Usage

```tsx
const [value, setValue, isControlled] = useControllableState({ initialValue: 'initial' });
```

## Type Declarations

```tsx
export interface UseControllableStateOptions<Value> {
  /** The initial value for uncontrolled state */
  initialValue?: Value;
  /** The controlled value */
  value?: Value;
  /** The onChange callback */
  onChange?: (value: Value) => void;
}

export type UseControllableStateReturn<Value> = [
  /** Current value */
  value: Value,
  /** Setter function that works with both controlled and uncontrolled state */
  setValue: (nextValue: ((prevValue: Value) => Value) | Value) => void,
  /** Whether the state is controlled */
  isControlled: boolean
];
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.value | `Value` | - | The controlled value. When provided, the component becomes controlled |
| options.initialValue | `Value` | - | The initial value for uncontrolled state |
| options.onChange | `(value: Value) => void` | - | The callback function called when the state changes |

### Returns

`UseControllableStateReturn<Value>` - A tuple containing the current value, setter function, and controlled flag