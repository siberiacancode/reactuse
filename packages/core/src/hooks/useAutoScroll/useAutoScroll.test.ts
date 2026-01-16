import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useAutoScroll } from './useAutoScroll';

const trigger = createTrigger<Node, MutationCallback>();
const mockMutationObserverObserve = vi.fn();
const mockMutationObserverDisconnect = vi.fn();

class MockMutationObserver {
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  callback: MutationCallback;

  observe = (target: Node) => {
    trigger.add(target, this.callback);
    mockMutationObserverObserve();
  };

  disconnect = () => mockMutationObserverDisconnect();
}

globalThis.MutationObserver = MockMutationObserver as any;

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

const element = document.getElementById('target') as HTMLElement;

beforeEach(() => {
  Object.defineProperty(element, 'scrollTo', {
    value: vi.fn(),
    writable: true
  });
  Object.defineProperty(element, 'scrollHeight', {
    value: 1000,
    writable: true
  });
  Object.defineProperty(element, 'clientHeight', {
    value: 500,
    writable: true
  });
  Object.defineProperty(element, 'scrollTop', { value: 0, writable: true });
  trigger.clear();
});

afterEach(vi.clearAllMocks);

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use auto scroll', () => {
      const { result } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should use auto scroll on server side', () => {
      const { result } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should auto scroll when content changes', () => {
      const { result } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) act(() => result.current(element));

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });
    });

    it('Should respect enabled option', () => {
      const { result } = renderHook(() => {
        if (target)
          return useAutoScroll(target, {
            enabled: false
          }) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>({ enabled: false });
      });

      if (!target) act(() => result.current(element));

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();
    });

    it('Should respect force option', () => {
      const { result } = renderHook(() => {
        if (target)
          return useAutoScroll(target, {
            force: true
          }) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>({ force: true });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 200 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });
    });

    it('Should handle auto scroll on manual scroll up', () => {
      const { result } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) act(() => result.current(element));

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 200 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 300 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });
    });

    it('Should handle touch events', () => {
      const { result } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(
          new TouchEvent('touchstart', {
            touches: [{ clientY: 100 } as Touch]
          })
        );
        element.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientY: 200 } as Touch]
          })
        );
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 400 });
        element.dispatchEvent(
          new TouchEvent('touchstart', {
            touches: [{ clientY: 200 } as Touch]
          })
        );

        element.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientY: 100 } as Touch]
          })
        );
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) act(() => result.current(element));

      unmount();

      expect(mockMutationObserverDisconnect).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
          return useAutoScroll<HTMLElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current(element));

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById('target') });

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
