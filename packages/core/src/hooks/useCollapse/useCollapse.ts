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
