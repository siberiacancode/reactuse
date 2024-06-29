import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

export type UseIntersectionObserverTarget = RefObject<Element | null> | (() => Element) | Element;

export interface UseIntersectionObserverOptions extends Omit<IntersectionObserverInit, 'root'> {
  enabled?: boolean;
  onChange?: (entry: IntersectionObserverEntry) => void;
  root?: IntersectionObserverInit['root'] | RefObject<Element | null>;
}

const getTargetElement = (target: UseIntersectionObserverTarget) => {
  if (typeof target === 'function') {
    return target();
  }

  if (target instanceof Element) {
    return target;
  }

  return target.current;
};

const getRootElement = (root: UseIntersectionObserverOptions['root']) => {
  if (!root) return document;

  if (root instanceof Element) {
    return root;
  }

  if (root instanceof Document) {
    return root;
  }

  return root.current;
};

export interface UseIntersectionObserverReturn {
  inView: boolean;
  entry?: IntersectionObserverEntry;
}

export type UseIntersectionObserver = {
  <Target extends UseIntersectionObserverTarget>(
    target: Target,
    options?: UseIntersectionObserverOptions
  ): UseIntersectionObserverReturn;

  <Target extends UseIntersectionObserverTarget>(
    options?: UseIntersectionObserverOptions,
    target?: never
  ): UseIntersectionObserverReturn & { ref: RefObject<Target> };
};

export const useIntersectionObserver = ((...params: any[]) => {
  const target = (
    typeof params[0] === 'object' && !('current' in params[0]) ? undefined : params[0]
  ) as UseIntersectionObserverTarget | undefined;
  const options = (target ? params[1] : params[0]) as UseIntersectionObserverOptions | undefined;
  const enabled = options?.enabled ?? true;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const internalRef = useRef<Element>(null);
  const onChangeRef = useRef<UseIntersectionObserverOptions['onChange']>();
  onChangeRef.current = options?.onChange;

  useEffect(() => {
    if (!enabled) return;

    const element = target ? getTargetElement(target) : internalRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        onChangeRef.current?.(entry);
      },
      {
        ...options,
        root: getRootElement(options?.root)
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, options?.rootMargin, options?.threshold, enabled]);

  if (target) return { entry, inView: !!entry?.isIntersecting };
  return { ref: internalRef, entry, inView: !!entry?.isIntersecting };
}) as UseIntersectionObserver;
