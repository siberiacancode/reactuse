import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

import type { StateRef } from '@/hooks';
import type { HookTarget } from '@/utils/helpers';

import { useRefState } from '@/hooks';
import { getElement, isTarget } from '@/utils/helpers';

const getRootIndent = (root: Document | HTMLElement) => {
  if (!(root instanceof HTMLElement))
    return { leftIndent: 0, rightIndent: 0, topIndent: 0, bottomIndent: 0 };
  const style = getComputedStyle(root);
  return {
    leftIndent:
      (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.borderLeftWidth) || 0),
    rightIndent:
      (Number.parseFloat(style.paddingRight) || 0) +
      (Number.parseFloat(style.borderRightWidth) || 0),
    topIndent:
      (Number.parseFloat(style.paddingTop) || 0) + (Number.parseFloat(style.borderTopWidth) || 0),
    bottomIndent:
      (Number.parseFloat(style.paddingBottom) || 0) +
      (Number.parseFloat(style.borderBottomWidth) || 0)
  };
};

const getRelativeBoundingClientRect = (element: HTMLElement, parent: HTMLElement) => {
  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  const { leftIndent, topIndent, bottomIndent, rightIndent } = getRootIndent(parent);

  const left = elementRect.left - parentRect.left - leftIndent;
  const top = elementRect.top - parentRect.top - topIndent;
  const right = elementRect.right - parentRect.left + rightIndent;
  const bottom = elementRect.bottom - parentRect.top + bottomIndent;

  return {
    left,
    top,
    right,
    bottom,
    width: elementRect.width,
    height: elementRect.height
  };
};

const getPageOffset = (element: HTMLElement) => {
  return {
    pageOffsetTop: element.getBoundingClientRect().top,
    pageOffsetBottom: element.getBoundingClientRect().bottom,
    pageOffsetLeft: element.getBoundingClientRect().left,
    pageOffsetRight: element.getBoundingClientRect().right
  };
};

const getRelativeOffset = (element: HTMLElement, root: HTMLElement) => {
  return {
    pageOffsetTop: getRelativeBoundingClientRect(element, root).top,
    pageOffsetBottom: getRelativeBoundingClientRect(element, root).bottom,
    pageOffsetLeft: getRelativeBoundingClientRect(element, root).left,
    pageOffsetRight: getRelativeBoundingClientRect(element, root).right
  };
};

const getStickyOffsets = (element: HTMLElement) => {
  return {
    stickyOffsetTop: Number.parseInt(getComputedStyle(element).top),
    stickyOffsetBottom: Number.parseInt(getComputedStyle(element).bottom),
    stickyOffsetLeft: Number.parseInt(getComputedStyle(element).left),
    stickyOffsetRight: Number.parseInt(getComputedStyle(element).right)
  };
};

/** The use sticky root type */
export type UseStickyRoot = Document | Element | RefObject<Element | null | undefined>;

/** The use sticky return type */
export interface UseStickyReturn<Target> {
  ref: StateRef<Target>;
  stuck: boolean;
}

/** The use sticky axis type */
export type UseStickyAxis = 'horizontal' | 'vertical';

/** The use sticky options type */
export interface UseStickyOptions {
  axis: UseStickyAxis;
  root?: HookTarget;
}

export interface UseSticky {
  <Target extends Element>(target: HookTarget, options?: UseStickyOptions): UseStickyReturn<Target>;

  <Target extends Element>(options?: UseStickyOptions, target?: never): UseStickyReturn<Target>;
}

/**
 * @name UseSticky
 * @description - Hook that allows you to detect that your sticky component is stuck
 * @category Browser
 *
 * @overload
 * @param {HookTarget} target The target sticky element
 * @param {UseStickyAxis} [options.axis='vertical'] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn} The state of the sticky
 *
 * @example
 * const { stuck } = useSticky(ref, {axis: 'vertical'});
 *
 * @overload
 * @param {UseStickyAxis} [options.axis='vertical'] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn} The state of the sticky
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

    const element = (target ? getElement(target) : internalRef.current) as HTMLElement;

    if (!element) return;

    const root = options?.root ? (getElement(options.root) as Document | HTMLElement) : document;

    const onSticky = () => {
      const { pageOffsetTop, pageOffsetBottom, pageOffsetLeft, pageOffsetRight } =
        root instanceof Document ? getPageOffset(element) : getRelativeOffset(element, root);
      const { stickyOffsetTop, stickyOffsetBottom, stickyOffsetLeft, stickyOffsetRight } =
        getStickyOffsets(element);

      const scrollTop = root instanceof Document ? window.innerHeight : root.offsetHeight;
      const scrollLeft = root instanceof Document ? window.innerWidth : root.offsetWidth;

      const stuckTop = pageOffsetTop <= stickyOffsetTop;
      const stuckBottom = scrollTop - pageOffsetBottom <= stickyOffsetBottom;
      const stuckLeft = pageOffsetLeft <= stickyOffsetLeft;
      const stuckRight = scrollLeft - pageOffsetRight <= stickyOffsetRight;

      const stuck = {
        vertical: stuckTop || stuckBottom,
        horizontal: stuckLeft || stuckRight
      }[axis];
      setStuck(stuck);
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
  }, [target, internalRef.state, axis, options?.root]);

  return {
    stuck,
    ref: internalRef
  };
}) as UseSticky;
