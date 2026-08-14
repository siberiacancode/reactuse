---
title: useClickOutside
description: Hook to handle click events outside the specified target element(s)
category: elements
usage: necessary
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1775645190000
---

# useClickOutside

Hook to handle click events outside the specified target element(s)

## Demo

```tsx
import { useClickOutside, useDisclosure } from '@siberiacancode/reactuse';
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';

const Demo = () => {
  const dropdownMenu = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());

  return (
    <section className='flex flex-col items-center'>
      <div className='relative w-full max-w-xs'>
        <div
          className='flex w-full cursor-pointer items-center justify-between gap-3 transition-colors'
          onClick={() => dropdownMenu.toggle()}
        >
          <div className='relative shrink-0'>
            <div className='flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 text-sm font-semibold text-white'>
              SC
            </div>
            <span className='ring-background absolute right-0 bottom-0 block size-2.5 rounded-full bg-green-500 ring-2' />
          </div>

          <div className='flex flex-col items-start gap-0.5'>
            <span className='text-sm font-medium'>siberiacancode</span>
            <span className='text-muted-foreground text-xs'>Opensource team</span>
          </div>
        </div>

        {dropdownMenu.opened && (
          <div
            ref={ref}
            className='absolute top-full right-0 left-0 mt-4'
            data-slot='dropdown-menu-content'
          >
            <div data-slot='dropdown-menu-item' onClick={dropdownMenu.close}>
              <UserIcon />
              Profile
            </div>
            <div data-slot='dropdown-menu-item' onClick={dropdownMenu.close}>
              <CreditCardIcon />
              Billing
            </div>
            <div data-slot='dropdown-menu-item' onClick={dropdownMenu.close}>
              <SettingsIcon />
              Settings
              <span className='text-xs' data-slot='dropdown-menu-shortcut'>
                ⌘S
              </span>
            </div>
            <div data-slot='dropdown-menu-separator' />
            <div
              data-slot='dropdown-menu-item'
              data-variant='destructive'
              onClick={dropdownMenu.close}
            >
              <LogOutIcon />
              Sign out
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
npx useverse@latest add useClickOutside
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export interface UseClickOutside {
  (target: HookTarget, callback: (event: Event) => void): void;

  <Target extends Element>(callback: (event: Event) => void, target?: never): StateRef<Target>;
}

/**
 * @name useClickOutside
 * @description - Hook to handle click events outside the specified target element(s)
 * @category Elements 
 * @usage necessary

 * @overload
 * @param {HookTarget} target The target element(s) to detect outside clicks for
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @returns {void}
 *
 * @example
 * useClickOutside(ref, () => console.log('click outside'));
 *
 * @overload
 * @template Target The target element(s)
 * @param {(event: Event) => void} callback The callback to execute when a click outside the target is detected
 * @returns {StateRef<Target>} A ref to attach to the target element
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => console.log('click outside'));
 *
 * @see {@link https://siberiacancode.github.io/reactuse/functions/hooks/useClickOutside.html}
 */
export const useClickOutside = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (params[1] ? params[1] : params[0]) as (event: Event) => void;

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const onClick = (event: Event) => {
      if (!element.contains(event.target as Node)) {
        internalCallbackRef.current(event);
      }
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);
  if (target) return;
  return internalRef;
}) as UseClickOutside;
```

Update the import paths to match your project setup.

## Usage

```tsx
useClickOutside(ref, () => console.log('click outside'));
// or
const ref = useClickOutside<HTMLDivElement>(() => console.log('click outside'));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseClickOutside {
  (target: HookTarget, callback: (event: Event) => void): void;

  <Target extends Element>(callback: (event: Event) => void, target?: never): StateRef<Target>;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element(s) to detect outside clicks for |
| callback | `(event: Event) => void` | - | The callback to execute when a click outside the target is detected |

#### Returns

`void`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(event: Event) => void` | - | The callback to execute when a click outside the target is detected |

#### Returns

`StateRef<Target>` - A ref to attach to the target element