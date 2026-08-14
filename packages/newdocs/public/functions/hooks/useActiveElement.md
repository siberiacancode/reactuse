---
title: useActiveElement
description: Hook for tracking the active element
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1776957880000
---

# useActiveElement

Hook for tracking the active element

## Demo

```tsx
import { useActiveElement } from '@siberiacancode/reactuse';
import { AtSignIcon, InfoIcon } from 'lucide-react';

const HINTS = {
  name: 'Enter your full name so we know how to address you.',
  email: "We'll only use your email to reply — no spam, ever.",
  message: 'Describe your question or issue in as much detail as you like.',
  cancel: 'This will discard everything you have entered.',
  submit: 'Double-check your details, then send the form our way.'
};

const Demo = () => {
  const activeElement = useActiveElement<HTMLDivElement>();
  const activeId = activeElement?.value?.dataset?.id;
  const hint = activeId ? HINTS[activeId] : 'Focus any field to see a helpful tip here.';

  return (
    <section>
      <div ref={activeElement.ref} className='flex max-w-md flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h3>Contact form</h3>
          <p className='text-muted-foreground text-xs'>
            Fill in your details below and we'll get back to you shortly.
          </p>
        </div>

        <form className='flex flex-col gap-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='flex flex-col gap-2 text-sm'>
              Name
              <input data-id='name' placeholder='John' type='text' />
            </label>

            <label className='flex flex-col gap-2 text-sm'>
              Email
              <div className='relative'>
                <AtSignIcon className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50' />
                <input
                  className='pl-8!'
                  data-id='email'
                  placeholder='john@example.com'
                  type='email'
                />
              </div>
            </label>
          </div>

          <label className='flex flex-col gap-2 text-sm'>
            Message
            <textarea data-id='message' placeholder='Type your message...' rows={5} />
          </label>

          <div className='border-border bg-muted/40 flex items-start gap-2.5 rounded-lg border p-3'>
            <InfoIcon className='text-muted-foreground mt-0.5 size-4 shrink-0' />
            <p className='text-muted-foreground text-xs leading-relaxed'>{hint}</p>
          </div>

          <div className='flex justify-end gap-2'>
            <button data-id='cancel' data-variant='outline' type='button'>
              Cancel
            </button>
            <button data-id='submit' type='button'>
              Submit
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
npx useverse@latest add useActiveElement
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use active element return type */
export interface UseActiveElementReturn<ActiveElement extends HTMLElement = HTMLElement> {
  value: ActiveElement | null;
}

export interface UseActiveElement {
  (): UseActiveElementReturn;

  <Target extends Element, ActiveElement extends HTMLElement = HTMLElement>(
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseActiveElementReturn<ActiveElement>;

  <ActiveElement extends HTMLElement = HTMLElement>(
    target: HookTarget
  ): UseActiveElementReturn<ActiveElement>;
}

/**
 * @name useActiveElement
 * @description - Hook for tracking the active element
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} [target=window] The target element to observe active element changes
 * @returns {ActiveElement | null} The active element
 *
 * @example
 * const activeElement = useActiveElement(ref);
 *
 * @overload
 * @template ActiveElement The active element type
 * @returns {{ ref: StateRef<Element>; activeElement: ActiveElement | null }} An object containing the ref and active element
 *
 * @example
 * const { ref, value } = useActiveElement();
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useActiveElement.html}
 */
export const useActiveElement = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const [value, setValue] = useState<HTMLElement | null>(null);
  const internalRef = useRefState();

  useEffect(() => {
    const element = ((target ? isTarget.getElement(target) : internalRef.current) ??
      window) as Element;

    const observer = new MutationObserver((mutations) => {
      mutations
        .filter((mutation) => mutation.removedNodes.length)
        .map((mutation) => [...mutation.removedNodes])
        .flat()
        .forEach((node) => {
          setValue((prevActiveElement) => {
            if (node === prevActiveElement) return document.activeElement as HTMLElement | null;
            return prevActiveElement;
          });
        });
    });

    observer.observe(element, {
      childList: true,
      subtree: true
    });

    const onActiveElementChange = () => setValue(document?.activeElement as HTMLElement | null);

    element.addEventListener('focus', onActiveElementChange, true);
    element.addEventListener('blur', onActiveElementChange, true);

    return () => {
      observer.disconnect();
      element.removeEventListener('focus', onActiveElementChange, true);
      element.removeEventListener('blur', onActiveElementChange, true);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { value };
  return {
    ref: internalRef,
    value
  };
}) as UseActiveElement;
```

Update the import paths to match your project setup.

## Usage

```tsx
const activeElement = useActiveElement(ref);
// or
const { ref, value } = useActiveElement();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseActiveElementReturn<ActiveElement extends HTMLElement = HTMLElement> {
  value: ActiveElement | null;
}

export interface UseActiveElement {
  (): UseActiveElementReturn;

  <Target extends Element, ActiveElement extends HTMLElement = HTMLElement>(
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseActiveElementReturn<ActiveElement>;

  <ActiveElement extends HTMLElement = HTMLElement>(
    target: HookTarget
  ): UseActiveElementReturn<ActiveElement>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | window | The target element to observe active element changes |

#### Returns

`ActiveElement | null` - The active element

### Overload 2

#### Returns

`{ ref: StateRef<Element>; activeElement: ActiveElement | null }` - An object containing the ref and active element