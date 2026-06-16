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
