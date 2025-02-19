import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

import { getElement, isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The mutation observer target element type */
export type UseMutationObserverTarget =
  | string
  | Document
  | Element
  | RefObject<Element | null | undefined>;

/** The mutation observer return type */
export interface UseMutationObserverReturn {
  /** The mutation observer instance */
  observer: MutationObserver;
  /** The mutation observer entries */
  stop: () => void;
}

/** The mutation observer options type */
export interface UseMutationObserverOptions extends MutationObserverInit {
  /** The enabled state of the mutation observer */
  enabled?: boolean;
}

export interface UseMutationObserver {
  <Target extends UseMutationObserverTarget>(
    target: Target,
    callback: MutationCallback,
    options?: UseMutationObserverOptions
  ): UseMutationObserverReturn;

  <Target extends UseMutationObserverTarget>(
    callback: MutationCallback,
    options?: UseMutationObserverOptions,
    target?: never
  ): UseMutationObserverReturn & { ref: StateRef<Target> };
}

/**
 * @name useMutationObserver
 * @description - Hook that gives you mutation observer state
 * @category Browser
 *
 * @overload
 * @template Target The target element
 * @param {MutationCallback} callback The callback to execute when mutation is detected
 * @param {boolean} [options.enabled=true] The enabled state of the mutation observer
 * @param {boolean} [options.attributes] Set to true if mutations to target's attributes are to be observed
 * @param {boolean} [options.characterData] Set to true if mutations to target's data are to be observed
 * @param {boolean} [options.childList] Set to true if mutations to target's children are to be observed
 * @param {boolean} [options.subtree]  Set to true if mutations to not just target, but also target's descendants are to be observed
 * @param {boolean} [options.characterDataOldValue] Set to true if characterData is set to true or omitted and target's data before the mutation needs to be recorded
 * @param {boolean} [options.attributeOldValue]  Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted
 * @param {string[]} [options.attributeFilter] Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted
 * @returns {UseMutationObserverReturn & { ref: StateRef<Target> }} An object containing the mutation observer state
 *
 * @example
 * const { ref, observer, stop } = useMutationObserver(() => console.log('callback'))
 *
 * @overload
 * @template Target The target element
 * @param {Target} target The target element to observe
 * @param {MutationCallback} callback The callback to execute when mutation is detected
 * @param {boolean} [options.enabled=true] The enabled state of the mutation observer
 * @param {boolean} [options.attributes] Set to true if mutations to target's attributes are to be observed
 * @param {boolean} [options.characterData] Set to true if mutations to target's data are to be observed
 * @param {boolean} [options.childList] Set to true if mutations to target's children are to be observed
 * @param {boolean} [options.subtree]  Set to true if mutations to not just target, but also target's descendants are to be observed
 * @param {boolean} [options.characterDataOldValue] Set to true if characterData is set to true or omitted and target's data before the mutation needs to be recorded
 * @param {boolean} [options.attributeOldValue]  Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted
 * @param {string[]} [options.attributeFilter] Set to a list of attribute local names (without namespace) if not all attribute mutations need to be observed and attributes is true or omitted
 * @returns {UseMutationObserverReturn} An object containing the mutation observer state
 *
 * @example
 * const { observer, stop } = useMutationObserver(ref, () => console.log('callback'))
 */
export const useMutationObserver = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as
    | UseMutationObserverTarget
    | undefined;
  const callback = (target ? params[1] : params[0]) as MutationCallback;
  const options = (target ? params[2] : params[1]) as UseMutationObserverOptions | undefined;

  const [observer, setObserver] = useState<MutationObserver>();
  const enabled = options?.enabled ?? true;

  const internalRef = useRefState<Element>(window.document.documentElement);
  const internalCallbackRef = useRef<MutationCallback>(callback);
  internalCallbackRef.current = callback;
  const internalOptionsRef = useRef(options);
  internalOptionsRef.current = options;

  useEffect(() => {
    if (!enabled && !target && !internalRef.current) return;

    const element = (target ? getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const observer = new MutationObserver(internalCallbackRef.current);
    setObserver(observer);
    observer.observe(element, internalOptionsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [target, internalRef.current]);

  const stop = () => observer?.disconnect();

  if (target) return { stop, observer };
  return {
    ref: internalRef,
    stop,
    observer
  };
}) as UseMutationObserver;
