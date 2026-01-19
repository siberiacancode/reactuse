import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';
import { isTarget, target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseSizeReturn } from './useSize';

import { useSize } from './useSize';

const trigger = createTrigger<Element, ResizeObserverCallback>();
const mockGetBoundingClientRect = vi.spyOn(Element.prototype, 'getBoundingClientRect');
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

beforeEach(() => vi.stubGlobal('ResizeObserver', mockResizeObserver));
afterEach(vi.unstubAllGlobals);

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') },
  Object.assign(() => {}, {
    state: document.getElementById('target'),
    current: document.getElementById('target')
  })
];

const element = document.getElementById('target') as HTMLDivElement;

targets.forEach((target) => {
  beforeEach(() => {
    mockResizeObserverObserve.mockClear();
    mockResizeObserverDisconnect.mockClear();
  });

  describe(`${target}`, () => {
    it('Should use size', () => {
      mockGetBoundingClientRect.mockImplementation(() => new DOMRect(0, 0, 0, 0));
      const { result } = renderHook(() => {
        if (target)
          return useSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseSizeReturn;
        return useSize<HTMLDivElement>();
      });
      expect(result.current.value).toStrictEqual({ width: 0, height: 0 });
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should use size on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseSizeReturn;
        return useSize<HTMLDivElement>();
      });

      expect(result.current.value).toStrictEqual({ width: 0, height: 0 });
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should set initial value', () => {
      mockGetBoundingClientRect.mockImplementation(() => new DOMRect(0, 0, 200, 200));
      const { result } = renderHook(() => {
        if (target)
          return useSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseSizeReturn;
        return useSize<HTMLDivElement>();
      });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      expect(result.current.value).toStrictEqual({ width: 200, height: 200 });
    });

    it('Should change value after resize', () => {
      mockGetBoundingClientRect.mockImplementation(() => new DOMRect(0, 0, 0, 0));
      const { result } = renderHook(() => {
        if (target)
          return useSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseSizeReturn;
        return useSize<HTMLDivElement>();
      });

      expect(result.current.value).toStrictEqual({ width: 0, height: 0 });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      act(() => {
        const element = (
          target ? isTarget.getElement(target) : result.current.ref.current
        ) as Element;
        if (!element) return;

        mockGetBoundingClientRect.mockImplementation(() => new DOMRect(0, 0, 200, 200));

        trigger.callback(element);
      });

      expect(mockResizeObserverObserve).toHaveBeenCalledOnce();
      expect(result.current.value).toStrictEqual({ width: 200, height: 200 });
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useSize(target) as {
              ref: StateRef<HTMLDivElement>;
            } & UseSizeReturn;
          return useSize<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(1);
      expect(mockResizeObserverDisconnect).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockResizeObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it('Should clean up on unmount', () => {
      mockGetBoundingClientRect.mockImplementation(() => new DOMRect(0, 0, 0, 0));
      const { result, unmount } = renderHook(() => {
        if (target)
          return useSize(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseSizeReturn;
        return useSize<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(mockResizeObserverDisconnect).toHaveBeenCalledOnce();
    });
  });
});
