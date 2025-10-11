import type { RefObject } from 'react';

export const targetSymbol = Symbol('target');

export type Target = (() => Element) | string | Document | Element | Window;

export type HookTarget =
  | RefObject<Element | null | undefined>
  | {
      value: Target;
      type: symbol;
    };

const getElement = (target: HookTarget) => {
  if ('current' in target) {
    return target.current;
  }

  if (typeof target.value === 'function') {
    return target.value();
  }

  if (typeof target.value === 'string') {
    return document.querySelector(target.value);
  }

  if (target.value instanceof Document) {
    return target.value;
  }

  if (target.value instanceof Window) {
    return target.value;
  }

  if (target.value instanceof Element) {
    return target.value;
  }

  return target.value;
};

export const target = (target: Target) => ({
  value: target,
  type: targetSymbol
});

export const isTarget = (target: HookTarget) =>
  typeof target === 'object' &&
  ('current' in target || (target && (target as any).type === targetSymbol));

isTarget.wrap = target;
isTarget.getElement = getElement;
