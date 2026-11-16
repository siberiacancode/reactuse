---
title: useFocus
description: Hook that allows you to focus on a specific element
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768553242000
---

# useFocus

Hook that allows you to focus on a specific element

## Demo

```tsx
import { useBoolean, useField, useFocus } from '@siberiacancode/reactuse';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

interface Rule {
  description: string;
  id: string;
  title: string;
  check: (value: string) => boolean;
}

const RULES: Rule[] = [
  {
    id: 'length',
    title: 'At least 8 characters',
    description: 'The longer, the better',
    check: (value) => value.length >= 8
  },
  {
    id: 'uppercase',
    title: 'One uppercase letter',
    description: 'Like A, B, C...',
    check: (value) => /[A-Z]/.test(value)
  },
  {
    id: 'number',
    title: 'One number',
    description: 'Digits from 0 to 9',
    check: (value) => /\d/.test(value)
  },
  {
    id: 'special',
    title: 'One special character',
    description: 'Such as !, @, #, $, %',
    check: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value)
  }
];

const Demo = () => {
  const passwordField = useField('');
  const password = passwordField.watch();

  const { focused } = useFocus(passwordField.ref);
  const [visible, toggleVisible] = useBoolean(false);

  const passedRules = RULES.filter((rule) => rule.check(password)).length;
  const showRules = focused || (!!password && passedRules < RULES.length);

  return (
    <section className='flex w-full max-w-sm flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Create a password</h2>
        <p className='text-muted-foreground text-xs'>
          Choose a strong password to protect your account.
        </p>
      </div>

      <div className='relative'>
        <input
          className='border-border bg-card text-foreground w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none'
          id='password'
          placeholder='Enter password'
          type={visible ? 'text' : 'password'}
          {...passwordField.register()}
        />
        <button
          aria-label={visible ? 'Hide password' : 'Show password'}
          className='absolute top-1/2 right-0 -translate-y-1/2'
          data-variant='unstyled'
          type='button'
          onClick={() => toggleVisible()}
        >
          {visible ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
        </button>

        {showRules && (
          <div className='border-border bg-card absolute top-full right-0 left-0 z-10 mt-2 flex flex-col gap-2 rounded-lg border p-3 shadow-lg'>
            <div className='flex items-center justify-between'>
              <span className='text-foreground text-xs font-medium'>Password requirements</span>
              <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
                {passedRules} / {RULES.length}
              </span>
            </div>

            <div className='flex flex-col gap-1.5'>
              {RULES.map((rule) => {
                const passed = rule.check(password);
                return (
                  <div key={rule.id} className='flex items-start gap-2'>
                    <span
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full transition-colors',
                        passed ? 'bg-green-500/15 text-green-500' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {passed && <CheckIcon className='size-3' strokeWidth={3} />}
                      {!passed && <XIcon className='size-3' strokeWidth={2.5} />}
                    </span>
                    <div className='flex flex-col leading-tight'>
                      <span
                        className={cn(
                          'text-xs font-medium transition-colors',
                          passed ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {rule.title}
                      </span>
                      <span className='text-muted-foreground text-[10px]'>{rule.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
npx useverse@latest add useFocus
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use focus options type */
export interface UseFocusOptions {
  /** The enabled state of the focus hook */
  enabled?: boolean;
  /** The initial focus state of the target */
  initialValue?: boolean;
  /** The on blur callback */
  onBlur?: (event: FocusEvent) => void;
  /** The on focus callback */
  onFocus?: (event: FocusEvent) => void;
}

/** The use focus return type */
export interface UseFocusReturn {
  /** The boolean state value of the target */
  focused: boolean;
  /** Blur the target */
  blur: () => void;
  /** Focus the target */
  focus: () => void;
}

export interface UseFocus {
  (target: HookTarget, callback?: (event: FocusEvent) => void): UseFocusReturn;

  (target: HookTarget, options?: UseFocusOptions): UseFocusReturn;

  <Target extends Element>(
    callback?: (event: FocusEvent) => void,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseFocusOptions,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };
}

/**
 * @name useFocus
 * @description - Hook that allows you to focus on a specific element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {(event: FocusEvent) => void} [callback] The callback function to be invoked on focus
 * @returns {UseFocusReturn} An object with focus state and methods
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref, () => console.log('focused'));
 *
 * @overload
 * @param {HookTarget} target The target element to focus
 * @param {boolean} [options.enabled=true] The enabled state of the focus hook
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @param {(event: FocusEvent) => void} [options.onFocus] The callback function to be invoked on focus
 * @param {(event: FocusEvent) => void} [options.onBlur] The callback function to be invoked on blur
 * @returns {UseFocusReturn} An object with focus state and methods
 *
 * @example
 * const { focus, blur, focused } = useFocus(ref);
 *
 * @overload
 * @template Target The target element
 * @param {(event: FocusEvent) => void} [callback] The callback function to be invoked on focus
 * @returns {UseFocusReturn & { ref: StateRef<Target> }} An object with focus state, methods and ref
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus(() => console.log('focused'));
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.enabled=true] The enabled state of the focus hook
 * @param {boolean} [options.initialValue=false] The initial focus state of the target
 * @param {(event: FocusEvent) => void} [options.onFocus] The callback function to be invoked on focus
 * @param {(event: FocusEvent) => void} [options.onBlur] The callback function to be invoked on blur
 * @returns {UseFocusReturn & { ref: StateRef<Target> }} An object with focus state, methods and ref
 *
 * @example
 * const { ref, focus, blur, focused } = useFocus();
 */
export const useFocus = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onFocus: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onFocus: params[0] }
  ) as UseFocusOptions | undefined;
  const enabled = options?.enabled ?? true;
  const initialValue = options?.initialValue ?? false;

  const [focused, setFocused] = useState(initialValue);
  const internalRef = useRefState<Element>();
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  const elementRef = useRef<HTMLElement | null>(null);

  const focus = () => {
    if (!elementRef.current) return;
    elementRef.current.focus();
    setFocused(true);
  };

  const blur = () => {
    if (!elementRef.current) return;
    elementRef.current.blur();
    setFocused(false);
  };

  useEffect(() => {
    if (!enabled || (!target && !internalRef.state)) return;
    const element = (target ? isTarget.getElement(target) : internalRef.current) as HTMLElement;
    if (!element) return;

    elementRef.current = element;

    const onFocus = (event: FocusEvent) => {
      internalOptionsRef.current?.onFocus?.(event);
      if (!focus || (event.target as HTMLElement).matches?.(':focus-visible')) setFocused(true);
    };

    const onBlur = (event: FocusEvent) => {
      internalOptionsRef.current?.onBlur?.(event);
      setFocused(false);
    };

    if (initialValue) element.focus();

    element.addEventListener('focus', onFocus);
    element.addEventListener('blur', onBlur);

    return () => {
      element.removeEventListener('focus', onFocus);
      element.removeEventListener('blur', onBlur);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, enabled]);

  if (target) return { focus, blur, focused };
  return {
    ref: internalRef,
    focus,
    blur,
    focused
  };
}) as UseFocus;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { focus, blur, focused } = useFocus(ref, () => console.log('focused'));
// or
const { focus, blur, focused } = useFocus(ref);
// or
const { ref, focus, blur, focused } = useFocus(() => console.log('focused'));
// or
const { ref, focus, blur, focused } = useFocus();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseFocusOptions {
  /** The enabled state of the focus hook */
  enabled?: boolean;
  /** The initial focus state of the target */
  initialValue?: boolean;
  /** The on blur callback */
  onBlur?: (event: FocusEvent) => void;
  /** The on focus callback */
  onFocus?: (event: FocusEvent) => void;
}

export interface UseFocusReturn {
  /** The boolean state value of the target */
  focused: boolean;
  /** Blur the target */
  blur: () => void;
  /** Focus the target */
  focus: () => void;
}

export interface UseFocus {
  (target: HookTarget, callback?: (event: FocusEvent) => void): UseFocusReturn;

  (target: HookTarget, options?: UseFocusOptions): UseFocusReturn;

  <Target extends Element>(
    callback?: (event: FocusEvent) => void,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };

  <Target extends Element>(
    options?: UseFocusOptions,
    target?: never
  ): UseFocusReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to focus |
| callback | `(event: FocusEvent) => void` | - | The callback function to be invoked on focus |

#### Returns

`UseFocusReturn` - An object with focus state and methods

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to focus |
| options.enabled | `boolean` | true | The enabled state of the focus hook |
| options.initialValue | `boolean` | false | The initial focus state of the target |
| options.onFocus | `(event: FocusEvent) => void` | - | The callback function to be invoked on focus |
| options.onBlur | `(event: FocusEvent) => void` | - | The callback function to be invoked on blur |

#### Returns

`UseFocusReturn` - An object with focus state and methods

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(event: FocusEvent) => void` | - | The callback function to be invoked on focus |

#### Returns

`UseFocusReturn & { ref: StateRef<Target> }` - An object with focus state, methods and ref

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.enabled | `boolean` | true | The enabled state of the focus hook |
| options.initialValue | `boolean` | false | The initial focus state of the target |
| options.onFocus | `(event: FocusEvent) => void` | - | The callback function to be invoked on focus |
| options.onBlur | `(event: FocusEvent) => void` | - | The callback function to be invoked on blur |

#### Returns

`UseFocusReturn & { ref: StateRef<Target> }` - An object with focus state, methods and ref