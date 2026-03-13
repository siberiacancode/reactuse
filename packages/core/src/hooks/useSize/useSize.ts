import { useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';
import { useRefState } from '../useRefState/useRefState';

/** The size value type */
export interface UseSizeValue {
  /** The element's height */
  height: number;
  /** The element's width */
  width: number;
}

/** The use size return type */
export interface UseSizeReturn {
  /** The resize observer instance */
  observer?: ResizeObserver;
  /** The current size value */
  value: UseSizeValue;
}

export interface UseSize {
  (target: HookTarget): UseSizeReturn;

  <Target extends Element>(
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseSizeReturn;
}

/**
 * @name useSize
 * @description - Hook that observes and returns the width and height of element
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target element to observe
 * @returns {UseSizeReturn} An object containing the resize observer, current width and height of the element
 *
 * @example
 * const { value, observer } = useSize(ref);
 *
 * @overload
 * @template Target The target element type
 * @returns { { ref: StateRef<Target> } & UseSizeReturn } An object containing the resize observer, current width and height of the element
 *
 * @example
 * const { ref, value, observer } = useSize();
 */
export const useSize = ((...params: any[]) => {
  const target = params[0] as HookTarget | undefined;
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [observer, setObserver] = useState<ResizeObserver>();
  const internalRef = useRefState<Element>();

  useIsomorphicLayoutEffect(() => {
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const { width, height } = element.getBoundingClientRect();
    setSize({
      width,
      height
    });

    const observer = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      setSize({ width, height });
    });

    setObserver(observer);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [internalRef.state, target && isTarget.getRawElement(target)]);

  if (target) return { observer, value: size };
  return {
    observer,
    ref: internalRef,
    value: size
  };
}) as UseSize;
