import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement } from '@/utils/helpers';

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

/** The use sticky target type */
export type UseStickyTarget = (() => Element) | Element | RefObject<Element | null | undefined>;

/** The use sticky root type */
export type UseStickyRoot = Document | Element | RefObject<Element | null | undefined>;

/** The use sticky return type */
export interface UseStickyReturn<Target> {
  stickyRef: RefObject<Target>;
  stuck: boolean;
}

/** The use sticky options type */
export interface UseStickyOptions {
  axis: 'horizontal' | 'vertical';
  root?: UseStickyRoot;
}

export interface UseSticky {
  <Target extends UseStickyTarget>(
    options: UseStickyOptions,
    target?: never
  ): UseStickyReturn<Target>;

  <Target extends UseStickyTarget>(
    target: Target,
    options: UseStickyOptions
  ): UseStickyReturn<Target>;
}

/**
 * @name UseSticky
 * @description - Hook that allows you to detect that your sticky component is stuck
 * @category Browser
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target sticky element
 * @param {'vertical' | 'horizontal'} [options.axis] The axis of motion of the sticky component
 * @param {Root} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn} An object with a `stuck` boolean state value
 *
 * @example
 * const { stuck } = useSticky(ref, {initialPosition: 'vertical'});
 *
 * @overload
 * @param {'vertical' | 'horizontal'} [options.axis] The axis of motion of the sticky component
 * @param {UseStickyRoot} [options.root=document] The element that contains your sticky component
 * @returns {UseStickyReturn} An object with a `stuck` boolean state value and `ref` for sticky element
 *
 * @example
 * const { stuck, ref } = useSticky({initialPosition: 'vertical'});
 */
export const useSticky = ((...params: any[]) => {
  const target = (
    typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]
  ) as UseStickyTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseStickyOptions;

  const stickyRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const element = (target ? getElement(target) : getElement(stickyRef)) as HTMLElement;
    const root = options?.root ? (getElement(options.root) as Document | HTMLElement) : document;

    if (!element || !root) return;

    const checkSticky = () => {
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
      }[options.axis];
      setStuck(stuck);
    };

    root.addEventListener('scroll', checkSticky);
    window.addEventListener('resize', checkSticky);
    window.addEventListener('orientationchange', checkSticky);

    checkSticky();

    return () => {
      root.removeEventListener('scroll', checkSticky);
      window.removeEventListener('resize', checkSticky);
      window.removeEventListener('orientationchange', checkSticky);
    };
  }, [options.axis, options.root, target]);

  return {
    stuck,
    stickyRef
  };
}) as UseSticky;
