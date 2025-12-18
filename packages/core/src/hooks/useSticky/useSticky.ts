import { useEffect, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use sticky return type */
export interface UseStickyReturn {
  stuck: boolean;
}

/** The use sticky axis type */
export type UseStickyAxis = 'horizontal' | 'vertical';

/** The use sticky options type */
export interface UseStickyOptions {
  axis?: UseStickyAxis;
  root?: HookTarget;
}

export interface UseSticky {
  (target: HookTarget, options?: UseStickyOptions): boolean;

  <Target extends Element>(
    options?: UseStickyOptions,
    target?: never
  ): {
    ref: StateRef<Target>;
  } & UseStickyReturn;
}

/**
 * @name UseSticky
 * @description - Hook that allows you to detect that your sticky component is stuck
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {HookTarget} target The target sticky element
 * @param {UseStickyAxis} [options.axis='vertical'] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn} The state of the sticky
 *
 * @example
 * const stuck  = useSticky(ref);
 *
 * @overload
 * @param {UseStickyAxis} [options.axis='vertical'] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {{ stickyRef: StateRef<Target> } & UseStickyReturn} The state of the sticky
 *
 * @example
 * const { stuck, ref } = useSticky();
 */
export const useSticky = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseStickyOptions;
  const axis = options?.axis ?? 'vertical';

  const internalRef = useRefState<Element>();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;

    if (!element) return;

    const root = (options?.root ? isTarget.getElement(options.root) : document) as Element;
    const elementOffsetTop =
      element.getBoundingClientRect().top + root.scrollTop - root.getBoundingClientRect().top;
    const elementOffsetLeft =
      element.getBoundingClientRect().left + root.scrollLeft - root.getBoundingClientRect().left;

    const onSticky = () => {
      if (axis === 'vertical') {
        const scrollTop = root.scrollTop;
        setStuck(scrollTop >= elementOffsetTop);
      }

      if (axis === 'horizontal') {
        const scrollLeft = root.scrollLeft;
        setStuck(scrollLeft >= elementOffsetLeft);
      }
    };

    root.addEventListener('scroll', onSticky);
    window.addEventListener('resize', onSticky);
    window.addEventListener('orientationchange', onSticky);

    onSticky();

    return () => {
      root.removeEventListener('scroll', onSticky);
      window.removeEventListener('resize', onSticky);
      window.removeEventListener('orientationchange', onSticky);
    };
  }, [target, internalRef.state, isTarget.getRefState(target), axis, options?.root]);

  if (target) return stuck;
  return {
    stuck,
    ref: internalRef
  };
}) as UseSticky;
