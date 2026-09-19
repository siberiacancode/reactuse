import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';
import { target, targetSymbol } from '@/utils/helpers';

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

  observe = (target: Node, options?: MutationObserverInit) => {
    trigger.add(target, this.callback);
    mockMutationObserverObserve(target, options);
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
      const { result } = renderHookServer(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should not subscribe when element is not resolved', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

      const { result } = renderHook(() => {
        if (target)
          return useAutoScroll({
            value: '#missing',
            type: targetSymbol
          }) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) expect(result.current).toBeTypeOf('function');

      expect(mockMutationObserverObserve).not.toHaveBeenCalled();
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('wheel', expect.any(Function));
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(addEventListenerSpy).not.toHaveBeenCalledWith('touchmove', expect.any(Function));
    });

    it('Should auto scroll when content changes', () => {
      const { result } = renderHook(() => {
        if (target) return useAutoScroll(target) as unknown as StateRef<HTMLElement>;
        return useAutoScroll<HTMLElement>();
      });

      if (!target) act(() => result.current(element));

      expect(mockMutationObserverObserve).toHaveBeenCalledWith(element, {
        childList: true,
        subtree: true,
        characterData: true
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });
    });

    it('Should handle enabled changes', () => {
      const { result, rerender } = renderHook(
        (enabled) => {
          if (target)
            return useAutoScroll(target, {
              enabled
            }) as unknown as StateRef<HTMLElement>;
          return useAutoScroll<HTMLElement>({ enabled });
        },
        { initialProps: false }
      );

      if (!target) act(() => result.current(element));

      expect(mockMutationObserverObserve).not.toHaveBeenCalled();

      rerender(true);

      expect(mockMutationObserverObserve).toHaveBeenCalledOnce();
      expect(mockMutationObserverDisconnect).not.toHaveBeenCalled();

      rerender(false);

      expect(mockMutationObserverDisconnect).toHaveBeenCalledOnce();
    });

    it('Should respect force option', () => {
      const { result, rerender } = renderHook(
        (force) => {
          if (target)
            return useAutoScroll(target, {
              force
            }) as unknown as StateRef<HTMLElement>;
          return useAutoScroll<HTMLElement>({ force });
        },
        { initialProps: true }
      );

      if (!target) act(() => result.current(element));

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 200 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));
      });

      rerender(false);

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });

      vi.mocked(element.scrollTo).mockClear();

      act(() => {
        element.dispatchEvent(
          new TouchEvent('touchstart', {
            touches: [{ clientY: 100 } as Touch]
          })
        );
      });

      rerender(true);

      act(() => {
        element.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientY: 200 } as Touch]
          })
        );
      });

      rerender(false);

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });

      vi.mocked(element.scrollTo).mockClear();

      rerender(true);

      act(() => {
        element.dispatchEvent(
          new TouchEvent('touchstart', {
            touches: [{ clientY: 300 } as Touch]
          })
        );
      });

      rerender(false);

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 400 });
        element.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientY: 200 } as Touch]
          })
        );
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();
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
        Object.defineProperty(element, 'scrollTop', { value: 100 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 250 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });

      vi.mocked(element.scrollTo).mockClear();

      act(() => element.dispatchEvent(new WheelEvent('wheel', { deltaY: 0 })));
      act(() => trigger.callback(element));

      expect(element.scrollTo).toHaveBeenCalledWith({ top: 1000 });

      vi.mocked(element.scrollTo).mockClear();

      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: 200 });
        element.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();
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
            touches: [{ clientY: 100 } as Touch]
          })
        );
        element.dispatchEvent(
          new TouchEvent('touchmove', {
            touches: [{ clientY: 150 } as Touch]
          })
        );
      });

      act(() => trigger.callback(element));

      expect(element.scrollTo).not.toHaveBeenCalled();

      act(() => {
        element.dispatchEvent(
          new TouchEvent('touchstart', {
            touches: [{ clientY: 100 } as Touch]
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

    it('Should recreate effect', () => {
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
});
