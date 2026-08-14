---
title: useFocusTrap
description: Hook that traps focus within a given element
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779803241000
---

# useFocusTrap

Hook that traps focus within a given element

## Demo

```tsx
import type { SubmitEvent } from 'react';

import { useField, useFocusTrap } from '@siberiacancode/reactuse';
import { AtSignIcon, ChevronDownIcon, XIcon } from 'lucide-react';

const ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' }
];

const Demo = () => {
  const focusTrap = useFocusTrap<HTMLDivElement>(true);

  const emailField = useField('');
  const roleField = useField('member');
  const messageField = useField('');

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    focusTrap.disable();
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        ref={focusTrap.ref}
        className='bg-card flex w-full flex-col gap-4 rounded-xl p-4 shadow-sm'
      >
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='text-foreground text-sm font-semibold'>Invite team member ✨</h3>
            <p className='text-muted-foreground text-xs'>
              They will receive an invitation by email.
            </p>
          </div>
          <button
            aria-label='Close'
            data-size='icon-sm'
            data-variant='ghost'
            type='button'
            onClick={focusTrap.disable}
          >
            <XIcon className='size-3.5' />
          </button>
        </div>

        <form className='flex flex-col gap-3' onSubmit={onSubmit}>
          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='email'>
              Email
            </label>
            <div className='relative'>
              <AtSignIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2' />
              <input
                data-autofocus
                className='pl-9!'
                id='email'
                placeholder='teammate@company.com'
                type='email'
                {...emailField.register()}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='role'>
              Role
            </label>
            <div className='relative'>
              <select className='w-full!' id='role' {...roleField.register()}>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2' />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='message'>
              Message <span className='text-muted-foreground font-normal'>(optional)</span>
            </label>
            <textarea
              id='message'
              placeholder='Welcome to the team!'
              {...messageField.register()}
            />
          </div>

          <div className='flex items-center justify-end gap-2'>
            <button data-size='sm' data-variant='ghost' type='button' onClick={focusTrap.disable}>
              Cancel
            </button>
            <button data-size='sm' type='submit'>
              Send invite
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
npx useverse@latest add useFocusTrap
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

export const FOCUS_SELECTOR = 'a, input, select, textarea, button, object, [tabindex]';

const getFocusableElements = (element: HTMLElement) => {
  const elements = [...element.querySelectorAll(FOCUS_SELECTOR)];
  return elements.filter((element) => {
    const htmlEl = element as HTMLElement;
    return htmlEl.tabIndex !== -1 && !htmlEl.hidden && htmlEl.style.display !== 'none';
  }) as HTMLElement[];
};

const focusElement = (element: HTMLElement) => {
  const autofocusElement = element.querySelector('[data-autofocus]') as HTMLElement;
  if (autofocusElement) return autofocusElement.focus();
  const focusableElements = getFocusableElements(element);
  if (focusableElements.length) focusableElements[0].focus();
};

/** The use focus trap return type */
export interface UseFocusTrapReturn {
  /** Whether focus trap is active */
  active: boolean;
  /** Disable focus trap */
  disable: () => void;
  /** Enable focus trap */
  enable: () => void;
  /** Toggle focus trap */
  toggle: () => void;
}

export interface UseFocusTrap {
  (target: HookTarget, active?: boolean): UseFocusTrapReturn;

  <Target extends HTMLElement>(
    active?: boolean,
    target?: never
  ): UseFocusTrapReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useFocusTrap
 * @description - Hook that traps focus within a given element
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element for focus trap
 * @param {boolean} [active=true] Whether focus trap is active
 * @returns {UseFocusTrapReturn} Object with the focus trap state and methods
 *
 * @example
 * const { active, disable, toggle, enable } = useFocusTrap(ref, true);
 *
 * @overload
 * @template Target The target element type
 * @param {boolean} [active=true] Whether focus trap is active
 * @returns {UseFocusTrapReturn & { ref: StateRef<Target> }} Object with the focus trap state and methods
 *
 * @example
 * const { ref, active, disable, toggle, enable } = useFocusTrap(true);
 */
export const useFocusTrap = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const initialActive = target ? params[1] : params[0];

  const [active, setActive] = useState(initialActive);
  const internalRef = useRefState<HTMLElement>();

  const enable = () => setActive(true);
  const disable = () => setActive(false);
  const toggle = () => setActive((prevActive: boolean) => !prevActive);

  useIsomorphicLayoutEffect(() => {
    if (!active) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;
    if (!element) return;

    const htmlElement = element as HTMLElement;
    focusElement(htmlElement);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const [firstElement, ...restElements] = getFocusableElements(htmlElement);
      if (!restElements.length) return;

      const lastElement = restElements.at(-1)!;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active, target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { active, enable, disable, toggle };
  return { active, enable, disable, toggle, ref: internalRef };
}) as UseFocusTrap;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { active, disable, toggle, enable } = useFocusTrap(ref, true);
// or
const { ref, active, disable, toggle, enable } = useFocusTrap(true);
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseFocusTrapReturn {
  /** Whether focus trap is active */
  active: boolean;
  /** Disable focus trap */
  disable: () => void;
  /** Enable focus trap */
  enable: () => void;
  /** Toggle focus trap */
  toggle: () => void;
}

export interface UseFocusTrap {
  (target: HookTarget, active?: boolean): UseFocusTrapReturn;

  <Target extends HTMLElement>(
    active?: boolean,
    target?: never
  ): UseFocusTrapReturn & {
    ref: StateRef<Target>;
  };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element for focus trap |
| active | `boolean` | true | Whether focus trap is active |

#### Returns

`UseFocusTrapReturn` - Object with the focus trap state and methods

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| active | `boolean` | true | Whether focus trap is active |

#### Returns

`UseFocusTrapReturn & { ref: StateRef<Target> }` - Object with the focus trap state and methods