---
title: useTextareaAutosize
description: Hook that automatically adjusts textarea height based on content
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1768553242000
---

# useTextareaAutosize

Hook that automatically adjusts textarea height based on content

## Demo

```tsx
import type { SubmitEvent } from 'react';

import { useField, useTextareaAutosize } from '@siberiacancode/reactuse';
import { UserIcon } from 'lucide-react';

const Demo = () => {
  const nameField = useField('');
  const message = useTextareaAutosize();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-col gap-0.5'>
          <h3 className='text-foreground text-sm font-semibold'>Feedback</h3>
          <p className='text-muted-foreground text-xs'>
            Tell us what's working, what's not, or what you'd love to see.
          </p>
        </div>

        <form className='flex flex-col gap-3' onSubmit={onSubmit}>
          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='name'>
              Name
            </label>
            <div className='relative'>
              <UserIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2' />
              <input
                className='pl-9!'
                id='name'
                placeholder='Your name'
                {...nameField.register()}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='message'>
              Feedback
            </label>
            <textarea
              ref={message.ref}
              className='no-scrollbar resize-none'
              id='message'
              placeholder='Share your thoughts — this box grows as you type…'
              style={{ minHeight: '72px', maxHeight: '200px' }}
            />
          </div>

          <div className='flex items-center justify-end'>
            <button data-size='sm' disabled={!message.value.length} type='submit'>
              Send
            </button>
          </div>
        </form>
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
npx useverse@latest add useTextareaAutosize
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use textarea autosize options */
export interface UseTextareaAutosizeOptions {
  /** The initial value for the textarea */
  initialValue?: string;
  /** Callback function called when the textarea size changes */
  onResize?: () => void;
}

/** The use textarea autosize return type */
export interface UseTextareaAutosizeReturn {
  /** The current value of the textarea */
  value: string;
  /** Function to clear the textarea value */
  clear: () => void;
  /** Function to set the textarea value */
  set: (value: string) => void;
}

export interface UseTextareaAutosize {
  (target: HookTarget, options?: UseTextareaAutosizeOptions): UseTextareaAutosizeReturn;

  (target: HookTarget, initialValue: string): UseTextareaAutosizeReturn;

  <Target extends HTMLTextAreaElement = HTMLTextAreaElement>(
    initialValue: string,
    target?: never
  ): UseTextareaAutosizeReturn & {
    ref: StateRef<Target>;
  };

  <Target extends HTMLTextAreaElement = HTMLTextAreaElement>(
    options?: UseTextareaAutosizeOptions,
    target?: never
  ): UseTextareaAutosizeReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useTextareaAutosize
 * @description - Hook that automatically adjusts textarea height based on content
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target textarea element
 * @param {string} [options.initialValue] The initial value for the textarea
 * @param {Function} [options.onResize] Callback function called when the textarea size changes
 * @returns {UseTextareaAutosizeReturn} An object containing value, setValue and clear
 *
 * @example
 * const { value, setValue, clear } = useTextareaAutosize(ref);
 *
 * @overload
 * @param {HookTarget} target The target textarea element
 * @param {string} initialValue The initial value for the textarea
 * @returns {UseTextareaAutosizeReturn} An object containing value, setValue and clear
 *
 * @example
 * const { value, setValue, clear } = useTextareaAutosize(ref, 'initial');
 *
 * @overload
 * @template Target The textarea element type
 * @param {string} initialValue The initial value for the textarea
 * @returns {UseTextareaAutosizeReturn & { ref: StateRef<Target> }} An object containing ref, value, setValue and clear
 *
 * @example
 * const { ref, value, setValue, clear } = useTextareaAutosize('initial');
 *
 * @overload
 * @template Target The textarea element type
 * @param {string} [options.initialValue] The initial value for the textarea
 * @param {Function} [options.onResize] Callback function called when the textarea size changes
 * @returns {UseTextareaAutosizeReturn & { ref: StateRef<Target> }} An object containing ref, value, setValue and clear
 *
 * @example
 * const { ref, value, setValue, clear } = useTextareaAutosize();
 */
export const useTextareaAutosize = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { initialValue: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { initialValue: params[0] }
  ) as UseTextareaAutosizeOptions | undefined;

  const [value, setValue] = useState(options?.initialValue ?? '');
  const internalRef = useRefState<HTMLTextAreaElement>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollHeightRef = useRef(0);

  const onTextareaResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const originalMinHeight = textarea.style.minHeight;
    const originalMaxHeight = textarea.style.maxHeight;

    textarea.style.height = 'auto';
    textarea.style.minHeight = 'auto';
    textarea.style.maxHeight = 'none';

    const scrollHeight = textarea.scrollHeight;

    textarea.style.height = `${scrollHeight}px`;
    textarea.style.minHeight = originalMinHeight;
    textarea.style.maxHeight = originalMaxHeight;

    if (scrollHeight !== scrollHeightRef.current) options?.onResize?.();
    scrollHeightRef.current = scrollHeight;
  };

  const setTextareaValue = (newValue: string) => {
    setValue(newValue);
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.value = newValue;
    requestAnimationFrame(() => {
      onTextareaResize();
    });
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLTextAreaElement;
    if (!element) return;

    textareaRef.current = element;
    if (options?.initialValue) element.value = options.initialValue;

    onTextareaResize();

    const onInput = (event: InputEvent) => {
      const newValue = (event.target as HTMLTextAreaElement).value;
      setTextareaValue(newValue);

      requestAnimationFrame(() => {
        onTextareaResize();
      });
    };

    const onResize = () => {
      requestAnimationFrame(() => {
        onTextareaResize();
      });
    };

    element.addEventListener('input', onInput as EventListener);
    element.addEventListener('resize', onResize as EventListener);

    return () => {
      element.removeEventListener('input', onInput as EventListener);
      element.removeEventListener('resize', onResize as EventListener);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const clear = () => setValue('');

  if (target)
    return {
      value,
      set: setTextareaValue,
      clear
    };
  return {
    ref: internalRef,
    value,
    set: setTextareaValue,
    clear
  };
}) as UseTextareaAutosize;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, setValue, clear } = useTextareaAutosize(ref);
// or
const { value, setValue, clear } = useTextareaAutosize(ref, 'initial');
// or
const { ref, value, setValue, clear } = useTextareaAutosize('initial');
// or
const { ref, value, setValue, clear } = useTextareaAutosize();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseTextareaAutosizeOptions {
  /** The initial value for the textarea */
  initialValue?: string;
  /** Callback function called when the textarea size changes */
  onResize?: () => void;
}

export interface UseTextareaAutosizeReturn {
  /** The current value of the textarea */
  value: string;
  /** Function to clear the textarea value */
  clear: () => void;
  /** Function to set the textarea value */
  set: (value: string) => void;
}

export interface UseTextareaAutosize {
  (target: HookTarget, options?: UseTextareaAutosizeOptions): UseTextareaAutosizeReturn;

  (target: HookTarget, initialValue: string): UseTextareaAutosizeReturn;

  <Target extends HTMLTextAreaElement = HTMLTextAreaElement>(
    initialValue: string,
    target?: never
  ): UseTextareaAutosizeReturn & {
    ref: StateRef<Target>;
  };

  <Target extends HTMLTextAreaElement = HTMLTextAreaElement>(
    options?: UseTextareaAutosizeOptions,
    target?: never
  ): UseTextareaAutosizeReturn & {
    ref: StateRef<Target>;
  };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target textarea element |
| options.initialValue | `string` | - | The initial value for the textarea |
| options.onResize | `Function` | - | Callback function called when the textarea size changes |

#### Returns

`UseTextareaAutosizeReturn` - An object containing value, setValue and clear

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target textarea element |
| initialValue | `string` | - | The initial value for the textarea |

#### Returns

`UseTextareaAutosizeReturn` - An object containing value, setValue and clear

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `string` | - | The initial value for the textarea |

#### Returns

`UseTextareaAutosizeReturn & { ref: StateRef<Target> }` - An object containing ref, value, setValue and clear

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.initialValue | `string` | - | The initial value for the textarea |
| options.onResize | `Function` | - | Callback function called when the textarea size changes |

#### Returns

`UseTextareaAutosizeReturn & { ref: StateRef<Target> }` - An object containing ref, value, setValue and clear