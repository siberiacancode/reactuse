'use client';

import type { UseEventListenerOptions } from '@siberiacancode/reactuse';
import type { RefObject } from 'react';

import { useCounter, useEventListener } from '@siberiacancode/reactuse';
import { useState } from 'react';

export const targetSymbol = Symbol('target');

export type Target = (() => Document | Element | Window) | string | Document | Element | Window;
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

/**
 * @name useDocumentEvent
 * @description - Hook attaches an event listener to the document object for the specified event
 * @category Browser
 * @usage low

 * @template Event Key of document event map.
 * @param {Event} event The event to listen for.
 * @param {(event: DocumentEventMap[Event]) => void} listener The callback function to be executed when the event is triggered
 * @param {UseEventListenerOptions} [options] The options for the event listener
 * @returns {void}
 *
 * @example
 * useDocumentEvent('click', () => console.log('clicked'));
 */
export const useDocumentEvent = <Event extends keyof DocumentEventMap>(
  event: Event,
  listener: (this: Document, event: DocumentEventMap[Event]) => any,
  options?: UseEventListenerOptions
) =>
  useEventListener(
    isTarget.wrap(() => document),
    event,
    listener,
    options
  );

const Demo = () => {
  const counter = useCounter();
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  useDocumentEvent('click', (event) => {
    counter.inc();
    setLastPosition({ x: event.clientX, y: event.clientY });
  });

  return (
    <section className='flex flex-col items-center gap-4 p-8 select-none'>
      <span className='text-foreground font-mono text-6xl font-semibold tabular-nums'>
        {String(counter.value).padStart(3, '0')}
      </span>

      <p className='text-muted-foreground text-sm'>Click anywhere on the page</p>

      <span className='text-muted-foreground font-mono text-xs tracking-wider tabular-nums'>
        {lastPosition.x}, {lastPosition.y}
      </span>
    </section>
  );
};

export default Demo;
