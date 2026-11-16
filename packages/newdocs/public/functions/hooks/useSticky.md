---
title: useSticky
description: Hook that allows you to detect that your sticky component is stuck
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781625261000
---

# useSticky

Hook that allows you to detect that your sticky component is stuck

## Demo

```tsx
import { useSticky } from '@siberiacancode/reactuse';
import { useRef } from 'react';

import { cn } from '@/utils/lib';

const PARAGRAPHS = [
  'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.',
  'Every hook follows the same shape, so once you learn one you already know the rest. Options go in, a small object comes out, and the ref is always there when you need to attach to a DOM node.',
  'The library is built specifically for React. It leans on modern browser APIs and wraps them in ergonomic, predictable interfaces you can drop into any component.',
  'Because everything is tree-shakeable, you only ship what you import. No giant runtime, no hidden dependencies — just the hooks you actually use, typed end to end.',
  'Scroll down. While at the top the header is just a logo. The moment it sticks, useSticky flips its stuck flag — it turns into a floating pill and reveals a call-to-action.',
  'That single boolean is all you need to build polished scroll-aware navigation, collapsing toolbars, or shadow-on-scroll effects without wiring up scroll listeners by hand.'
];

const Demo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref, stuck } = useSticky<HTMLElement>({ root: rootRef });

  return (
    <section className='flex w-full max-w-xl flex-col'>
      <div ref={rootRef} className='no-scrollbar h-96 overflow-y-auto px-3'>
        <div className='h-4' />

        <header
          ref={ref}
          className={cn(
            'sticky top-3 z-10 flex h-12 items-center justify-between gap-3 rounded-full transition-[background-color,box-shadow,border-color,padding] duration-300',
            stuck
              ? 'bg-card/85 border-border border px-3 shadow-md backdrop-blur'
              : 'border border-transparent bg-transparent'
          )}
        >
          <div className='flex items-center gap-2'>
            <img alt='reactuse' className='size-5' src='https://reactuse.org/logo.svg' />
            <span className='text-foreground font-semibold tracking-tight'>reactuse</span>
          </div>

          <button
            className={cn(
              'rounded-full! transition-all duration-300',
              stuck ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0'
            )}
            data-size='sm'
            type='button'
          >
            Getting started
          </button>
        </header>

        <div className='flex flex-col gap-4 px-1 pt-4 pb-4'>
          <h1 className='text-foreground text-3xl font-semibold tracking-tight'>Meet reactuse</h1>
          {PARAGRAPHS.map((text, index) => (
            <p key={index} className='text-foreground text-base leading-relaxed'>
              {text}
            </p>
          ))}
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
npx useverse@latest add useSticky
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

import type { StateRef } from '@/hooks';
import type { HookTarget } from '@/utils/helpers';

import { useRefState } from '@/hooks';
import { isTarget } from '@/utils/helpers';

const parseLength = (value: string): number | null => {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const getRootIndent = (root: Document | HTMLElement) => {
  if (!(root instanceof HTMLElement))
    return { leftIndent: 0, rightIndent: 0, topIndent: 0, bottomIndent: 0 };

  const style = getComputedStyle(root);
  return {
    leftIndent: (parseLength(style.paddingLeft) ?? 0) + (parseLength(style.borderLeftWidth) ?? 0),
    rightIndent:
      (parseLength(style.paddingRight) ?? 0) + (parseLength(style.borderRightWidth) ?? 0),
    topIndent: (parseLength(style.paddingTop) ?? 0) + (parseLength(style.borderTopWidth) ?? 0),
    bottomIndent:
      (parseLength(style.paddingBottom) ?? 0) + (parseLength(style.borderBottomWidth) ?? 0)
  };
};

const getRelativeBoundingClientRect = (element: HTMLElement, parent: HTMLElement) => {
  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const { leftIndent, topIndent, bottomIndent, rightIndent } = getRootIndent(parent);

  return {
    left: elementRect.left - parentRect.left - leftIndent,
    top: elementRect.top - parentRect.top - topIndent,
    right: elementRect.right - parentRect.left + rightIndent,
    bottom: elementRect.bottom - parentRect.top + bottomIndent,
    width: elementRect.width,
    height: elementRect.height
  };
};

const getElementOffset = (element: HTMLElement, root: Document | HTMLElement) => {
  if (root instanceof Document) {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
  }

  const rect = getRelativeBoundingClientRect(element, root);
  return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
};

const getStickyOffsets = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  return {
    top: parseLength(style.top),
    bottom: parseLength(style.bottom),
    left: parseLength(style.left),
    right: parseLength(style.right)
  };
};

/** The use sticky root type */
export type UseStickyRoot = Document | Element | RefObject<Element | null | undefined>;

/** The use sticky axis type */
export type UseStickyAxis = 'horizontal' | 'vertical';

/** The use sticky options type */
export interface UseStickyOptions {
  /** The axis of motion of the sticky component @default 'vertical' */
  axis?: UseStickyAxis;
  /** The element that contains your sticky component @default document */
  root?: HookTarget;
}

/** The use sticky return type */
export interface UseStickyReturn {
  stuck: boolean;
}

export interface UseSticky {
  (target: HookTarget, options?: UseStickyOptions): UseStickyReturn;

  <Target extends Element>(
    options?: UseStickyOptions,
    target?: never
  ): UseStickyReturn & { ref: StateRef<Target> };
}

/**
 * @name useSticky
 * @description - Hook that allows you to detect that your sticky component is stuck
 * @category Browser
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target sticky element
 * @param {UseStickyAxis} [options.axis='vertical'] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn} The state of the sticky
 *
 * @example
 * const { stuck } = useSticky(ref, { axis: 'vertical' });
 *
 * @overload
 * @param {UseStickyAxis} [options.axis='vertical'] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn & { ref: StateRef<Target> }} The state of the sticky
 *
 * @example
 * const { stuck, ref } = useSticky();
 */
export const useSticky = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseStickyOptions | undefined;
  const axis = options?.axis ?? 'vertical';

  const internalRef = useRefState<Element>();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as HTMLElement;
    if (!element) return;

    const root = (options?.root ? isTarget.getElement(options.root) : document) as
      | Document
      | HTMLElement;
    if (!root) return;

    const onSticky = () => {
      const offset = getElementOffset(element, root);
      const sticky = getStickyOffsets(element);

      const viewportHeight = root instanceof Document ? window.innerHeight : root.offsetHeight;
      const viewportWidth = root instanceof Document ? window.innerWidth : root.offsetWidth;

      const stuckTop = sticky.top !== null && offset.top <= sticky.top;
      const stuckBottom = sticky.bottom !== null && viewportHeight - offset.bottom <= sticky.bottom;
      const stuckLeft = sticky.left !== null && offset.left <= sticky.left;
      const stuckRight = sticky.right !== null && viewportWidth - offset.right <= sticky.right;

      setStuck(axis === 'vertical' ? stuckTop || stuckBottom : stuckLeft || stuckRight);
    };

    root.addEventListener('scroll', onSticky, { passive: true });
    window.addEventListener('resize', onSticky);
    window.addEventListener('orientationchange', onSticky);

    onSticky();

    return () => {
      root.removeEventListener('scroll', onSticky);
      window.removeEventListener('resize', onSticky);
      window.removeEventListener('orientationchange', onSticky);
    };
  }, [
    target && isTarget.getRawElement(target),
    internalRef.state,
    axis,
    options?.root && isTarget.getRawElement(options.root)
  ]);

  if (target) return { stuck };
  return { stuck, ref: internalRef };
}) as UseSticky;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { stuck } = useSticky(ref, { axis: 'vertical' });
// or
const { stuck, ref } = useSticky();
```

## Type Declarations

```tsx
import type { RefObject } from 'react';

import type { StateRef } from '@/hooks';

import type { HookTarget } from '@/utils/helpers';

export type UseStickyRoot = Document | Element | RefObject<Element | null | undefined>;

export type UseStickyAxis = 'horizontal' | 'vertical';

export interface UseStickyOptions {
  /** The axis of motion of the sticky component @default 'vertical' */
  axis?: UseStickyAxis;
  /** The element that contains your sticky component @default document */
  root?: HookTarget;
}

export interface UseStickyReturn {
  stuck: boolean;
}

export interface UseSticky {
  (target: HookTarget, options?: UseStickyOptions): UseStickyReturn;

  <Target extends Element>(
    options?: UseStickyOptions,
    target?: never
  ): UseStickyReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target sticky element |
| options.axis | `UseStickyAxis` | 'vertical' | The axis of motion of the sticky component |
| options.root | `UseStickyRoot` | document | The element that contains your sticky component |

#### Returns

`UseStickyReturn` - The state of the sticky

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.axis | `UseStickyAxis` | 'vertical' | The axis of motion of the sticky component |
| options.root | `UseStickyRoot` | document | The element that contains your sticky component |

#### Returns

`UseStickyReturn & { ref: StateRef<Target> }` - The state of the sticky