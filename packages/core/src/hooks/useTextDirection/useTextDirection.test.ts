import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseTextDirectionReturn } from './useTextDirection';

import { useTextDirection } from './useTextDirection';

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
    mockMutationObserverObserve(target);
  };

  disconnect = () => mockMutationObserverDisconnect();
}

globalThis.MutationObserver = MockMutationObserver as any;

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') }
];
const element = document.getElementById('target') as HTMLDivElement;

afterEach(() => {
  element.removeAttribute('dir');
  vi.clearAllMocks();
  trigger.clear();
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use text direction', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('ltr');
      expect(result.current.remove).toBeTypeOf('function');
      expect(result.current.set).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(element.getAttribute('dir')).toBe('ltr');
    });

    it('Should use text direction on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });
      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('ltr');
      expect(result.current.remove).toBeTypeOf('function');
      expect(result.current.set).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(element.getAttribute('dir')).toBeNull();
    });

    it('Should return initial value', () => {
      element.setAttribute('dir', 'rtl');

      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('rtl');
      element.removeAttribute('dir');
    });

    it('Should set initial value', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target, 'rtl') as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>('rtl');
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('rtl');
      element.removeAttribute('dir');
    });

    it('Should set the direction attribute on a element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.set('ltr'));

      expect(element.getAttribute('dir')).toBe('ltr');
      expect(result.current.value).toBe('ltr');

      act(() => result.current.set('rtl'));

      expect(element.getAttribute('dir')).toBe('rtl');
      expect(result.current.value).toBe('rtl');

      element.removeAttribute('dir');
    });

    it('Should remove the direction attribute on a element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(element.getAttribute('dir')).toBe('ltr');
      expect(result.current.value).toBe('ltr');

      act(() => result.current.remove());

      expect(element.hasAttribute('dir')).toBeFalsy();
      expect(result.current.value).toBe('ltr');
    });

    it('Should update value when direction changes externally', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('ltr');

      act(() => {
        element.setAttribute('dir', 'rtl');
        trigger.callback(element);
      });

      expect(result.current.value).toBe('rtl');

      act(() => {
        element.setAttribute('dir', 'ltr');
        trigger.callback(element);
      });

      expect(result.current.value).toBe('ltr');
      element.removeAttribute('dir');
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useTextDirection(target) as {
              ref: StateRef<HTMLDivElement>;
            } & UseTextDirectionReturn;
          return useTextDirection<HTMLDivElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('ltr');
      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);
      expect(mockMutationObserverDisconnect).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(result.current.value).toBe('ltr');
      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it('Should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);

      unmount();

      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });
  });
});
