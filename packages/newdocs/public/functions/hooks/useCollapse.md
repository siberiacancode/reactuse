---
title: useCollapse
description: Hook that animates an element between collapsed and expanded states
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1794732747682
---

# useCollapse

Hook that animates an element between collapsed and expanded states

## Demo

```tsx
import { useCollapse } from '@siberiacancode/reactuse';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const FAQS = [
  {
    id: 'hooks',
    question: 'How many hooks are available in reactuse?',
    answer:
      'Reactuse includes 170+ production-ready hooks for state, browser APIs, async workflows, UI interactions, sensors, and more.'
  },
  {
    id: 'use-cases',
    question: 'What can I build with reactuse?',
    answer:
      'Build forms, media experiences, browser integrations, responsive interfaces, animations, and complex state flows without rewriting common logic.'
  },
  {
    id: 'benefits',
    question: 'Why should I choose reactuse?',
    answer:
      'Every hook is TypeScript-first, SSR compatible, tree-shakable, documented, and designed for real production applications.'
  }
];

interface FAQItemProps {
  answer: string;
  id: string;
  initiallyExpanded?: boolean;
  question: string;
}

const FAQItem = ({ id, question, answer, initiallyExpanded }: FAQItemProps) => {
  const collapse = useCollapse(initiallyExpanded);

  return (
    <div className='border-border border-b last:border-b-0'>
      <button
        aria-controls={id}
        aria-expanded={collapse.expanded}
        className='flex h-auto! w-full! items-center justify-between! gap-4 rounded-none! border-0! bg-transparent! px-0! py-4! text-left! text-base! font-semibold whitespace-normal!'
        data-size='unstyled'
        data-variant='unstyled'
        type='button'
        onClick={() => collapse.toggle()}
      >
        {question}
        <ChevronDownIcon
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform',
            collapse.expanded && 'rotate-180'
          )}
        />
      </button>

      <div ref={collapse.ref} aria-hidden={!collapse.expanded} id={id} inert={!collapse.expanded}>
        <p className='text-muted-foreground pb-4 text-base leading-relaxed'>{answer}</p>
      </div>
    </div>
  );
};

const Demo = () => (
  <section className='w-full max-w-lg px-4'>
    {FAQS.map((faq, index) => (
      <FAQItem key={faq.id} {...faq} initiallyExpanded={index === 0} />
    ))}
  </section>
);

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useCollapse
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The use collapse options type */
export interface UseCollapseOptions {
  /** Transition duration in milliseconds */
  duration?: number;
  /** CSS transition easing function */
  easing?: string;
  /** Callback invoked when the transition ends */
  onEnd?: () => void;
  /** Callback invoked when the transition starts */
  onStart?: () => void;
}

/** The use collapse return type */
export interface UseCollapseReturn {
  /** Whether the content is expanded */
  expanded: boolean;
  /** Collapse the content */
  close: () => void;
  /** Expand the content */
  open: () => void;
  /** Toggle the content */
  toggle: (value?: boolean) => void;
}

export interface UseCollapse {
  (target: HookTarget, initialValue?: boolean, options?: UseCollapseOptions): UseCollapseReturn;

  <Target extends HTMLElement = HTMLDivElement>(
    initialValue?: boolean,
    options?: UseCollapseOptions,
    target?: never
  ): UseCollapseReturn & { ref: StateRef<Target> };
}

interface ElementStyles {
  display: string;
  height: string;
  overflow: string;
  transition: string;
  willChange: string;
}

/**
 * @name useCollapse
 * @description - Hook that animates an element between collapsed and expanded states
 * @category Elements
 * @usage medium
 *
 * @overload
 * @param {HookTarget} target The target element to collapse
 * @param {boolean} [initialValue=false] Whether the target is initially expanded
 * @param {number} [options.duration=200] Transition duration in milliseconds
 * @param {string} [options.easing='ease'] CSS transition easing function
 * @param {() => void} [options.onStart] Callback invoked when the transition starts
 * @param {() => void} [options.onEnd] Callback invoked when the transition ends
 * @returns {UseCollapseReturn} The collapse state and controls
 *
 * @example
 * const { expanded, open, close, toggle } = useCollapse(ref);
 *
 * @overload
 * @template Target The target element type
 * @param {boolean} [initialValue=false] Whether the target is initially expanded
 * @param {number} [options.duration=200] Transition duration in milliseconds
 * @param {string} [options.easing='ease'] CSS transition easing function
 * @param {() => void} [options.onStart] Callback invoked when the transition starts
 * @param {() => void} [options.onEnd] Callback invoked when the transition ends
 * @returns {UseCollapseReturn & { ref: StateRef<Target> }} The ref, collapse state and controls
 *
 * @example
 * const { ref, expanded, open, close, toggle } = useCollapse();
 *
 * @see {@link https://reactuse.org/functions/hooks/useCollapse}
 */
export const useCollapse = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const initialValue = ((target ? params[1] : params[0]) as boolean | undefined) ?? false;
  const options = (target ? params[2] : params[1]) as UseCollapseOptions | undefined;

  const [expanded, setExpanded] = useState(initialValue);
  const internalRef = useRefState<Element>();
  const elementRef = useRef<HTMLElement | null>(null);
  const initialStylesRef = useRef<ElementStyles | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const internalOptionsRef = useRef(options);

  internalOptionsRef.current = options;

  useIsomorphicLayoutEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as HTMLElement;
    if (!element) return;

    const initialStyles = {
      display: element.style.display,
      height: element.style.height,
      overflow: element.style.overflow,
      transition: element.style.transition,
      willChange: element.style.willChange
    };
    elementRef.current = element;
    initialStylesRef.current = initialStyles;

    if (!expanded) {
      element.style.display = 'none';
      element.style.height = '0px';
      element.style.overflow = 'hidden';
    }

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== element || event.propertyName !== 'height') return;

      element.style.transition = initialStyles.transition;
      element.style.willChange = initialStyles.willChange;

      if (element.style.height !== '0px') {
        element.style.height = initialStyles.height;
        element.style.overflow = initialStyles.overflow;
      } else {
        element.style.display = 'none';
      }

      internalOptionsRef.current?.onEnd?.();
    };

    element.addEventListener('transitionend', onTransitionEnd);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      element.removeEventListener('transitionend', onTransitionEnd);
      Object.assign(element.style, initialStyles);
      elementRef.current = null;
      initialStylesRef.current = null;
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const updateExpanded = (value: boolean) => {
    if (expanded === value) return;

    setExpanded(value);

    const element = elementRef.current;
    const initialStyles = initialStylesRef.current;
    if (!element || !initialStyles) return;

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const duration = internalOptionsRef.current?.duration ?? 200;
    const easing = internalOptionsRef.current?.easing ?? 'ease';
    const currentHeight = element.getBoundingClientRect().height;

    element.style.display = initialStyles.display;
    element.style.height = `${currentHeight}px`;
    element.style.overflow = 'hidden';
    element.style.transition = 'none';
    element.style.willChange = 'height';

    internalOptionsRef.current?.onStart?.();

    if (duration === 0) {
      element.style.height = value ? initialStyles.height : '0px';
      element.style.overflow = value ? initialStyles.overflow : 'hidden';
      element.style.display = value ? initialStyles.display : 'none';
      element.style.transition = initialStyles.transition;
      element.style.willChange = initialStyles.willChange;
      internalOptionsRef.current?.onEnd?.();
      return;
    }

    element.getBoundingClientRect();
    element.style.transition = `height ${duration}ms ${easing}`;

    animationFrameRef.current = requestAnimationFrame(() => {
      element.style.height = value ? `${element.scrollHeight}px` : '0px';
    });
  };

  const open = () => updateExpanded(true);
  const close = () => updateExpanded(false);
  const toggle = (value = !expanded) => updateExpanded(value);

  if (target) return { expanded, open, close, toggle };
  return { ref: internalRef, expanded, open, close, toggle };
}) as UseCollapse;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { expanded, open, close, toggle } = useCollapse(ref);
// or
const { ref, expanded, open, close, toggle } = useCollapse();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseCollapseOptions {
  /** Transition duration in milliseconds */
  duration?: number;
  /** CSS transition easing function */
  easing?: string;
  /** Callback invoked when the transition ends */
  onEnd?: () => void;
  /** Callback invoked when the transition starts */
  onStart?: () => void;
}

export interface UseCollapseReturn {
  /** Whether the content is expanded */
  expanded: boolean;
  /** Collapse the content */
  close: () => void;
  /** Expand the content */
  open: () => void;
  /** Toggle the content */
  toggle: (value?: boolean) => void;
}

export interface UseCollapse {
  (target: HookTarget, initialValue?: boolean, options?: UseCollapseOptions): UseCollapseReturn;

  <Target extends HTMLElement = HTMLDivElement>(
    initialValue?: boolean,
    options?: UseCollapseOptions,
    target?: never
  ): UseCollapseReturn & { ref: StateRef<Target> };
}

interface ElementStyles {
  display: string;
  height: string;
  overflow: string;
  transition: string;
  willChange: string;
}
```

## API

### Overload 1

#### Parameters

| Name             | Type         | Default | Note                                        |
| ---------------- | ------------ | ------- | ------------------------------------------- |
| target           | `HookTarget` | -       | The target element to collapse              |
| initialValue     | `boolean`    | false   | Whether the target is initially expanded    |
| options.duration | `number`     | 200     | Transition duration in milliseconds         |
| options.easing   | `string`     | 'ease'  | CSS transition easing function              |
| options.onStart  | `() => void` | -       | Callback invoked when the transition starts |
| options.onEnd    | `() => void` | -       | Callback invoked when the transition ends   |

#### Returns

`UseCollapseReturn` - The collapse state and controls

### Overload 2

#### Parameters

| Name             | Type         | Default | Note                                        |
| ---------------- | ------------ | ------- | ------------------------------------------- |
| initialValue     | `boolean`    | false   | Whether the target is initially expanded    |
| options.duration | `number`     | 200     | Transition duration in milliseconds         |
| options.easing   | `string`     | 'ease'  | CSS transition easing function              |
| options.onStart  | `() => void` | -       | Callback invoked when the transition starts |
| options.onEnd    | `() => void` | -       | Callback invoked when the transition ends   |

#### Returns

`UseCollapseReturn & { ref: StateRef<Target> }` - The ref, collapse state and controls
