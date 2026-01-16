import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseElementVisibilityReturn } from './useElementVisibility';

import { useElementVisibility } from './useElementVisibility';

const trigger = createTrigger<Element, IntersectionObserverCallback>();

const createMockIntersectionObserverElement = (isIntersecting: boolean) => [
  {
    isIntersecting,
    element: document.getElementById('target') as HTMLDivElement
  } as unknown as IntersectionObserverEntry
];

const mockIntersectionObserverObserve = vi.fn();
const mockIntersectionObserverDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options || {};
  }

  callback: IntersectionObserverCallback;
  options: IntersectionObserverInit;

  observe = (element: Element) => {
    trigger.add(element, this.callback);
    mockIntersectionObserverObserve(element, this.options);
  };

  disconnect = () => mockIntersectionObserverDisconnect();
}

globalThis.IntersectionObserver = MockIntersectionObserver as any;

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

afterEach(() => {
  vi.clearAllMocks();
  trigger.clear();
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use intersection observer', () => {
      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.entry).toBeUndefined();
      expect(result.current.inView).toBeFalsy();
    });

    it('Should use intersection observer on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useElementVisibility(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.entry).toBeUndefined();
      expect(result.current.inView).toBeFalsy();
    });

    it('Should observe element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockIntersectionObserverObserve).toHaveBeenCalledTimes(1);
      expect(mockIntersectionObserverObserve).toHaveBeenCalledWith(element, expect.any(Object));
    });

    it('Should call onChange callback when intersection', () => {
      const onChange = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target, {
            onChange
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>({ onChange });
      });

      if (!target) act(() => result.current.ref(element));

      const [entry] = createMockIntersectionObserverElement(true);
      act(() => trigger.callback(element, [entry]));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(entry, expect.any(MockIntersectionObserver));
    });

    it('Should call callback on intersection', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      const [entry] = createMockIntersectionObserverElement(true);
      act(() => trigger.callback(element, [entry]));

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(entry, expect.any(MockIntersectionObserver));
    });

    it('Should update inView when element is intersecting', () => {
      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.inView).toBeFalsy();

      const [entry] = createMockIntersectionObserverElement(true);
      act(() => trigger.callback(element, [entry]));

      expect(result.current.inView).toBeTruthy();
      expect(result.current.entry).toBe(entry);
    });

    it('Should update inView when element is not intersecting', () => {
      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      const [entry] = createMockIntersectionObserverElement(true);
      act(() => trigger.callback(element, [entry]));

      expect(result.current.inView).toBeTruthy();

      const [entryNotIntersecting] = createMockIntersectionObserverElement(false);
      act(() => trigger.callback(element, [entryNotIntersecting]));

      expect(result.current.inView).toBeFalsy();
      expect(result.current.entry).toBe(entryNotIntersecting);
    });

    it('Should handle options properly', () => {
      const options = {
        threshold: 0.5,
        rootMargin: '10px'
      };

      const { result } = renderHook(() => {
        if (target)
          return useElementVisibility(target, options) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>(options);
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockIntersectionObserverObserve).toHaveBeenCalledWith(
        element,
        expect.objectContaining(options)
      );
    });
  });

  it('Should handle enabled option', () => {
    const { result } = renderHook(() => useElementVisibility<HTMLDivElement>({ enabled: false }));

    act(() => result.current.ref(element));

    const [entry] = createMockIntersectionObserverElement(true);
    act(() => trigger.callback(element, [entry]));

    expect(mockIntersectionObserverObserve).not.toHaveBeenCalled();
  });

  it('Should handle target changes', () => {
    const { result, rerender } = renderHook(
      (target) => {
        if (target)
          return useElementVisibility(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseElementVisibilityReturn;
        return useElementVisibility<HTMLDivElement>();
      },
      { initialProps: target }
    );

    if (!target) act(() => result.current.ref(element));

    expect(mockIntersectionObserverObserve).toHaveBeenCalledTimes(1);

    rerender({ current: document.getElementById('target') });

    expect(mockIntersectionObserverObserve).toHaveBeenCalledTimes(2);
    expect(mockIntersectionObserverDisconnect).toHaveBeenCalledTimes(1);
  });

  it('Should disconnect observer on unmount', () => {
    const { result, unmount } = renderHook(() => {
      if (target)
        return useElementVisibility(target) as unknown as {
          ref: StateRef<HTMLDivElement>;
        } & UseElementVisibilityReturn;
      return useElementVisibility<HTMLDivElement>();
    });

    if (!target) act(() => result.current.ref(element));

    unmount();

    expect(mockIntersectionObserverDisconnect).toHaveBeenCalledOnce();
  });
});
