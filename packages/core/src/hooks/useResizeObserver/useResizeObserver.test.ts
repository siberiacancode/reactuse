import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseResizeObserverReturn } from './useResizeObserver';

import { useResizeObserver } from './useResizeObserver';

const trigger = createTrigger<Element, ResizeObserverCallback>();

const createMockResizeObserverEntry = (
  contentRect: Partial<DOMRectReadOnly> = {}
): ResizeObserverEntry => ({
  target: document.getElementById('target') as HTMLDivElement,
  contentRect: {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    top: 0,
    right: 100,
    bottom: 100,
    left: 0,
    toJSON: () => ({}),
    ...contentRect
  } as DOMRectReadOnly,
  borderBoxSize: [] as unknown as ReadonlyArray<ResizeObserverSize>,
  contentBoxSize: [] as unknown as ReadonlyArray<ResizeObserverSize>,
  devicePixelContentBoxSize: [] as unknown as ReadonlyArray<ResizeObserverSize>
});

const mockResizeObserverObserve = vi.fn();
const mockResizeObserverDisconnect = vi.fn();

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  callback: ResizeObserverCallback;

  observe = (element: Element, options?: ResizeObserverOptions) => {
    trigger.add(element, this.callback);
    mockResizeObserverObserve(element, options);
  };

  disconnect = () => mockResizeObserverDisconnect();
}

globalThis.ResizeObserver = MockResizeObserver as any;

afterEach(() => {
  trigger.clear();
});

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
  describe(`${target}`, () => {
    it('Should use resize observer', () => {
      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useResizeObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.observer).toBeInstanceOf(MockResizeObserver);
      expect(result.current.entry).toBeUndefined();
    });

    it('Should use resize observer on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useResizeObserver(target) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useResizeObserver<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.observer).toBeUndefined();
      expect(result.current.entry).toBeUndefined();
    });

    it('Should observe element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useResizeObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(1);
      expect(mockResizeObserverObserve).toHaveBeenCalledWith(element, expect.any(Object));
    });

    it('Should call onChange callback when resize occurs', () => {
      const onChange = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target, {
            onChange
          }) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useResizeObserver<HTMLDivElement>({ onChange });
      });

      if (!target) act(() => result.current.ref(element));

      const resizeEntry = createMockResizeObserverEntry({
        width: 200,
        height: 150
      });
      act(() => trigger.callback(element, [resizeEntry], result.current.observer!));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(resizeEntry, result.current.observer);
    });

    it('Should call callback on resize', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target, callback) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useResizeObserver<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      const resizeEntry = createMockResizeObserverEntry({
        width: 300,
        height: 200
      });
      act(() => trigger.callback(element, [resizeEntry], result.current.observer!));

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(resizeEntry, result.current.observer);
    });

    it('Should update entries state on resize', () => {
      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useResizeObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.entry).toBeUndefined();

      const resizeEntry = createMockResizeObserverEntry({
        width: 400,
        height: 300
      });
      act(() => trigger.callback(element, [resizeEntry], result.current.observer!));

      expect(result.current.entry).toEqual(resizeEntry);
    });

    it('Should handle resize observer options', () => {
      const options = {
        box: 'border-box' as ResizeObserverBoxOptions
      };

      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target, options) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useResizeObserver<HTMLDivElement>(options);
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).toHaveBeenCalledWith(element, options);
    });

    it('Should handle enabled option', () => {
      const { result } = renderHook(() => {
        if (target)
          return useResizeObserver(target, {
            enabled: false
          }) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useResizeObserver<HTMLDivElement>({ enabled: false });
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useResizeObserver(target) as UseResizeObserverReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useResizeObserver<HTMLDivElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById('target') });

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockResizeObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it('Should disconnect observer on unmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target)
          return useResizeObserver(target) as UseResizeObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useResizeObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(mockResizeObserverDisconnect).toHaveBeenCalledOnce();
    });
  });
});
