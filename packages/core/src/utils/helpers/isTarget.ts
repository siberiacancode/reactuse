import type { RefObject } from 'react';

export const targetSymbol = Symbol('target');

export type Target = (() => Element) | string | Document | Element | Window;
interface BrowserTarget {
  type: symbol;
  value: Target;
}
interface StateRef<Value> {
  (node: Value): void;
  current: Value;
  state: Value;
}

export type HookTarget =
  | BrowserTarget
  | RefObject<Element | null | undefined>
  | StateRef<Element | null | undefined>;

export const target = (target: Target) => ({
  value: target,
  type: targetSymbol
});

export const isRef = (target: HookTarget) => typeof target === 'object' && 'current' in target;

export const isRefState = (target: HookTarget) =>
  typeof target === 'function' && 'state' in target && 'current' in target;

export const isBrowserTarget = (target: HookTarget) =>
  typeof target === 'object' &&
  target &&
  'type' in target &&
  target.type === targetSymbol &&
  'value' in target;

export const isTarget = (target: HookTarget) =>
  isRef(target) || isRefState(target) || isBrowserTarget(target);

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
export const getRefState = (target?: HookTarget) => target && 'state' in target && target.state;
export const getRawElement = (target: HookTarget) => {
  if (isRefState(target)) return target.state;
  if (isBrowserTarget(target)) return (target as BrowserTarget).value;

  return target;
};

isTarget.wrap = target;
isTarget.getElement = getElement;
isTarget.getRefState = getRefState;
isTarget.getRawElement = getRawElement;
