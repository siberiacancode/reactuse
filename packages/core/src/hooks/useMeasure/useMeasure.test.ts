import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseMeasureReturn } from './useMeasure';

import { useMeasure } from './useMeasure';

const trigger = createTrigger<Element, ResizeObserverCallback>();

const createMockResizeObserverEntry = (
  contentRect: Partial<DOMRectReadOnly> = {}
): ResizeObserverEntry => ({
  target: document.getElementById('target') as HTMLDivElement,
  contentRect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
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

  observe = (element: Element) => {
    trigger.add(element, this.callback);
    mockResizeObserverObserve(element);
  };

  disconnect = () => mockResizeObserverDisconnect();
  unobserve = vi.fn();
}

globalThis.ResizeObserver = MockResizeObserver as any;

afterEach(() => {
  vi.clearAllMocks();
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
    it('Should use measure', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMeasure(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseMeasureReturn;
        return useMeasure<HTMLDivElement>();
      });

      expect(result.current.x).toBe(0);
      expect(result.current.y).toBe(0);
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.top).toBe(0);
      expect(result.current.left).toBe(0);
      expect(result.current.bottom).toBe(0);
      expect(result.current.right).toBe(0);
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should use measure on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useMeasure(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseMeasureReturn;
        return useMeasure<HTMLDivElement>();
      });

      expect(result.current.x).toBe(0);
      expect(result.current.y).toBe(0);
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.top).toBe(0);
      expect(result.current.left).toBe(0);
      expect(result.current.bottom).toBe(0);
      expect(result.current.right).toBe(0);
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should observe element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMeasure(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseMeasureReturn;
        return useMeasure<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).toHaveBeenCalledOnce();
      expect(mockResizeObserverObserve).toHaveBeenCalledWith(element);
    });

    it('Should update measure values on resize', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMeasure(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseMeasureReturn;
        return useMeasure<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.x).toBe(0);
      expect(result.current.y).toBe(0);
      expect(result.current.width).toBe(0);
      expect(result.current.height).toBe(0);
      expect(result.current.top).toBe(0);
      expect(result.current.left).toBe(0);
      expect(result.current.bottom).toBe(0);
      expect(result.current.right).toBe(0);

      const resizeEntry = createMockResizeObserverEntry({
        x: 10,
        y: 20,
        width: 200,
        height: 100,
        top: 20,
        left: 10,
        bottom: 120,
        right: 210
      });

      act(() => trigger.callback(element, [resizeEntry]));

      expect(result.current.x).toBe(10);
      expect(result.current.y).toBe(20);
      expect(result.current.width).toBe(200);
      expect(result.current.height).toBe(100);
      expect(result.current.top).toBe(20);
      expect(result.current.left).toBe(10);
      expect(result.current.bottom).toBe(120);
      expect(result.current.right).toBe(210);
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useMeasure(target) as {
              ref: StateRef<HTMLDivElement>;
            } & UseMeasureReturn;
          return useMeasure<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(mockResizeObserverObserve).toHaveBeenCalledOnce();
      expect(mockResizeObserverDisconnect).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(mockResizeObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockResizeObserverDisconnect).toHaveBeenCalledOnce();
    });

    it('Should disconnect observer on unmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target)
          return useMeasure(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseMeasureReturn;
        return useMeasure<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(mockResizeObserverDisconnect).toHaveBeenCalledOnce();
    });
  });
});
