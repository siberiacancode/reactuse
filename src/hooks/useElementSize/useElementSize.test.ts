import { act, renderHook } from '@testing-library/react';

import { getElement } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseElementSizeReturn } from './useElementSize';

import { useElementSize } from './useElementSize';

export function createTrigger<Callback extends (...args: any[]) => void>() {
  const observers = new Map();
  return {
    callback(element: Element, ...args: Partial<Parameters<Callback>>) {
      const observe = observers.get(element);
      observe(...args);
    },
    add(element: Element, callback: Callback) {
      observers.set(element, callback);
    },
    delete(element: Element) {
      observers.delete(element);
    }
  };
}

const trigger = createTrigger<ResizeObserverCallback>();
const mockResizeObserverDisconnect = vi.fn();
const mockResizeObserverObserve = vi.fn();
const mockResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback;
  element: Element | undefined;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe = (element: Element) => {
    trigger.add(element, this.callback);
    mockResizeObserverObserve();
  };
  disconnect = () => {
    if (this.element) trigger.delete(this.element);
    mockResizeObserverDisconnect();
  };
  unobserve = vi.fn();
};
globalThis.ResizeObserver = mockResizeObserver;

const targets = [
  undefined,
  '#target',
  document.getElementById('target'),
  { current: document.getElementById('target') }
];

targets.forEach((target) => {
  beforeEach(() => {
    mockResizeObserverObserve.mockClear();
    mockResizeObserverDisconnect.mockClear();
  });

  describe(`${target}`, () => {
    it('Should use element size', () => {
      const { result } = renderHook(() => {
        if (target)
          return useElementSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementSizeReturn;
        return useElementSize<HTMLDivElement>();
      });
      expect(result.current.value).toStrictEqual({ width: 0, height: 0 });
      if (!target) expect(result.current.ref).toBeTypeOf('function');
    });

    it('Should set initial value', () => {
      const { result } = renderHook(() => {
        if (target) return useElementSize(target, { width: 200, height: 200 });
        return useElementSize<HTMLDivElement>({ width: 200, height: 200 });
      });

      expect(result.current.value).toStrictEqual({ width: 200, height: 200 });
    });

    it('Should change value after resize', () => {
      const { result } = renderHook(() => {
        if (target)
          return useElementSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementSizeReturn;
        return useElementSize<HTMLDivElement>();
      });

      expect(result.current.value).toStrictEqual({ width: 0, height: 0 });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      act(() => {
        const element = (target ? getElement(target) : result.current.ref.current) as Element;
        if (!element) return;

        trigger.callback(element, [
          { contentRect: { width: 200, height: 200 } }
        ] as unknown as ResizeObserverEntry[]);
      });

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(1);
      expect(result.current.value).toStrictEqual({ width: 200, height: 200 });
    });

    it('Should disconnect on onmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target)
          return useElementSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementSizeReturn;
        return useElementSize<HTMLDivElement>();
      });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      unmount();

      expect(mockResizeObserverDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
