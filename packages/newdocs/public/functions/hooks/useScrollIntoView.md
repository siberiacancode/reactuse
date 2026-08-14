---
title: useScrollIntoView
description: Hook that provides functionality to scroll an element into view
category: sensors
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1773843478000
---

# useScrollIntoView

Hook that provides functionality to scroll an element into view

## Demo

```tsx
import { useScrollIntoView } from '@siberiacancode/reactuse';
import { CheckIcon, ClockIcon, SparklesIcon, UserIcon } from 'lucide-react';

const INTRO = [
  'Another week, another batch of releases. We shipped a few new hooks, cleaned up the docs and finally landed the thing half of you have been asking for in the issues.',
  'But before the headline, a quick housekeeping note — the playground now runs on the latest build, so if something looked off yesterday, give it another try today.',
  'Alright, enough warm-up. Scroll past this and you will find what actually changed.'
];

const OUTRO = [
  'As always, everything is typed end to end, tree-shakeable, and covered by tests before it reaches a release.',
  'Thanks to everyone who opened an issue or a PR this cycle — half of these changes came straight from your feedback.',
  'See you in the next one. Stars on the repo are always appreciated and genuinely help other people find the project.'
];

const RELEASE_NOTES = [
  'Three new scroll hooks — useScroll, useScrollTo and useScrollIntoView',
  'Snapshot API so callbacks run without triggering rerenders',
  'Smaller bundle after dropping a couple of internal deps',
  'Docs playground rebuilt on the latest design system'
];

const Demo = () => {
  const scrollIntoView = useScrollIntoView<HTMLDivElement>({ behavior: 'smooth', block: 'center' });

  return (
    <section className='flex min-w-xs flex-col gap-4 md:min-w-md'>
      <div className='relative overflow-hidden rounded-xl'>
        <div className='no-scrollbar flex h-96 flex-col gap-5 overflow-y-auto p-5'>
          <header className='flex flex-col gap-2'>
            <h1 className='text-foreground text-2xl leading-tight font-semibold'>
              reactuse changelog — June
            </h1>
            <div className='text-muted-foreground flex items-center gap-3 text-sm'>
              <span className='flex items-center gap-1.5'>
                <UserIcon className='size-3.5' />
                debabin
              </span>
              <span className='flex items-center gap-1.5'>
                <ClockIcon className='size-3.5' />2 min read
              </span>
            </div>
          </header>

          <article className='flex flex-col gap-4'>
            {INTRO.map((text, index) => (
              <p key={index} className='text-foreground text-base leading-relaxed'>
                {text}
              </p>
            ))}
          </article>

          <div
            ref={scrollIntoView.ref}
            className='bg-muted text-foreground flex flex-col gap-3 rounded-lg p-4'
          >
            <span className='flex items-center gap-1.5 text-base font-semibold'>
              <SparklesIcon className='size-4' />
              What's new in this release
            </span>
            <ul className='flex flex-col gap-2 text-base leading-relaxed'>
              {RELEASE_NOTES.map((note, index) => (
                <li key={index} className='flex items-start gap-2'>
                  <CheckIcon className='text-primary mt-1 size-4 shrink-0' />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <article className='flex flex-col gap-4'>
            {OUTRO.map((text, index) => (
              <p key={index} className='text-foreground text-base leading-relaxed'>
                {text}
              </p>
            ))}
          </article>
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
npx useverse@latest add useScrollIntoView
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The scroll into view options type */
export interface UseScrollIntoViewOptions extends ScrollIntoViewOptions {
  /** Whether to immediately the scroll into view */
  immediately?: boolean;
}

/** The scroll into view return type */
export interface UseScrollIntoViewReturn {
  /** Function to scroll element into view */
  trigger: (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => void;
}

export interface UseScrollIntoView {
  <Target extends Element>(
    options?: UseScrollIntoViewOptions,
    target?: never
  ): UseScrollIntoViewReturn & { ref: StateRef<Target> };

  (target?: HookTarget, options?: UseScrollIntoViewOptions): UseScrollIntoViewReturn;
}

/**
 * @name useScrollIntoView
 * @description - Hook that provides functionality to scroll an element into view
 * @category Sensors
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to scroll into view
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn} Object containing scroll function
 *
 * @example
 * const { trigger } = useScrollIntoView(ref);
 *
 * @overload
 * @template Target The target element
 * @param {boolean} [options.immediately=true] Whether to scroll immediately
 * @param {ScrollBehavior} [options.behavior='smooth'] The scrolling behavior
 * @param {ScrollLogicalPosition} [options.block='start'] The vertical alignment
 * @param {ScrollLogicalPosition} [options.inline='nearest'] The horizontal alignment
 * @returns {UseScrollIntoViewReturn & { ref: StateRef<Target> }} Object containing scroll function and ref
 *
 * @example
 * const { ref, trigger } = useScrollIntoView<HTMLDivElement>();
 */
export const useScrollIntoView = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseScrollIntoViewOptions | undefined;

  const internalRef = useRefState<Element>();
  const {
    behavior = 'smooth',
    block = 'start',
    inline = 'nearest',
    immediately = true
  } = options ?? {};
  const elementRef = useRef<Element>(null);

  useIsomorphicLayoutEffect(() => {
    if (!immediately) return;
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    elementRef.current = element;

    element.scrollIntoView({
      behavior,
      block,
      inline
    });
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const trigger = (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => {
    if (!elementRef.current) return;

    const { behavior, block, inline } = params ?? {};

    elementRef.current.scrollIntoView({
      behavior,
      block,
      inline
    });
  };

  if (target) return { trigger };
  return { ref: internalRef, trigger };
}) as UseScrollIntoView;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { trigger } = useScrollIntoView(ref);
// or
const { ref, trigger } = useScrollIntoView<HTMLDivElement>();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseScrollIntoViewOptions extends ScrollIntoViewOptions {
  /** Whether to immediately the scroll into view */
  immediately?: boolean;
}

export interface UseScrollIntoViewReturn {
  /** Function to scroll element into view */
  trigger: (params?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  }) => void;
}

export interface UseScrollIntoView {
  <Target extends Element>(
    options?: UseScrollIntoViewOptions,
    target?: never
  ): UseScrollIntoViewReturn & { ref: StateRef<Target> };

  (target?: HookTarget, options?: UseScrollIntoViewOptions): UseScrollIntoViewReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to scroll into view |
| options.immediately | `boolean` | true | Whether to scroll immediately |
| options.behavior | `ScrollBehavior` | 'smooth' | The scrolling behavior |
| options.block | `ScrollLogicalPosition` | 'start' | The vertical alignment |
| options.inline | `ScrollLogicalPosition` | 'nearest' | The horizontal alignment |

#### Returns

`UseScrollIntoViewReturn` - Object containing scroll function

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.immediately | `boolean` | true | Whether to scroll immediately |
| options.behavior | `ScrollBehavior` | 'smooth' | The scrolling behavior |
| options.block | `ScrollLogicalPosition` | 'start' | The vertical alignment |
| options.inline | `ScrollLogicalPosition` | 'nearest' | The horizontal alignment |

#### Returns

`UseScrollIntoViewReturn & { ref: StateRef<Target> }` - Object containing scroll function and ref