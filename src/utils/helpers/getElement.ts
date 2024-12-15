import type { RefObject } from 'react';

export type GetElementTarget =
  | RefObject<Element | null | undefined>
  | (() => Element)
  | Element
  | Window
  | Document;

export const getElement = <Target extends GetElementTarget>(target: Target) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Document) {
    return target;
  }

  if (target instanceof Window) {
    return target;
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};
