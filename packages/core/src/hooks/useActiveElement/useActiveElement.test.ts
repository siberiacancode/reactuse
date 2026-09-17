import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseActiveElementReturn } from './useActiveElement';

import { useActiveElement } from './useActiveElement';

const trigger = createTrigger<Element, MutationCallback>();

const mockMutationObserverObserve = vi.fn();
const mockMutationObserverDisconnect = vi.fn();

class MockMutationObserver {
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  callback: MutationCallback;

  observe = (element: Element, options?: MutationObserverInit) => {
    trigger.add(element, this.callback);
    mockMutationObserverObserve(element, options);
  };

  disconnect = () => mockMutationObserverDisconnect();
}

globalThis.MutationObserver = MockMutationObserver as any;

beforeEach(trigger.clear);
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
    it('Should use active element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
      expect(result.current.value).toBeNull();
    });

    it('Should use active element on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
      expect(result.current.value).toBeNull();
    });

    it('Should observe child list mutations in target subtree', () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockMutationObserverObserve).toHaveBeenLastCalledWith(element, {
        childList: true,
        subtree: true
      });
    });

    it('Should set active element on focus', () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeNull();

      act(() => {
        element.focus();
        element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      });

      expect(result.current.value).toBe(element);
    });

    it('Should set active descendant on focus', () => {
      const child = document.createElement('button');
      element.appendChild(child);

      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: HTMLButtonElement | null;
          };
        return useActiveElement<HTMLDivElement, HTMLButtonElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => child.focus());

      expect(result.current.value).toBe(child);

      child.remove();
    });

    it('Should unset active element on blur', () => {
      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<Element>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) act(() => 'ref' in result.current! && result.current.ref(element));

      expect(result.current.value).toBeNull();

      act(() => {
        element.focus();
        element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
      });

      expect(result.current.value).toBe(element);

      act(() => element.blur());

      expect(result.current.value).toBe(document.activeElement);
    });

    it('Should unset active descendant on blur', () => {
      const child = document.createElement('button');
      element.appendChild(child);

      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: HTMLButtonElement | null;
          };
        return useActiveElement<HTMLDivElement, HTMLButtonElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => child.focus());
      expect(result.current.value).toBe(child);

      act(() => child.blur());

      expect(result.current.value).toBe(document.activeElement);

      child.remove();
    });

    it('Should update active element when tracked node is removed', () => {
      const child = document.createElement('button');
      element.appendChild(child);

      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: HTMLButtonElement | null;
          };
        return useActiveElement<HTMLDivElement, HTMLButtonElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => child.focus());
      expect(result.current.value).toBe(child);

      act(() => {
        child.remove();
        trigger.callback(element, [{ removedNodes: [child] } as unknown as MutationRecord]);
      });

      expect(result.current.value).toBe(document.activeElement);
    });

    it('Should preserve active element when unrelated node is removed', () => {
      const child = document.createElement('button');
      const unrelatedChild = document.createElement('button');
      const outsideElement = document.createElement('button');
      element.append(child, unrelatedChild);

      const { result } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: HTMLButtonElement | null;
          };
        return useActiveElement<HTMLDivElement, HTMLButtonElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => child.focus());
      expect(result.current.value).toBe(child);

      vi.spyOn(document, 'activeElement', 'get').mockReturnValue(outsideElement);

      act(() => {
        unrelatedChild.remove();
        trigger.callback(element, [
          { removedNodes: [unrelatedChild] } as unknown as MutationRecord
        ]);
      });

      expect(result.current.value).toBe(child);

      child.remove();
    });

    it('Should keep subscription when target resolves to same element', () => {
      const { result, rerender } = renderHook(
        (currentTarget) => {
          if (currentTarget)
            return useActiveElement(currentTarget) as unknown as {
              ref: StateRef<HTMLDivElement>;
              value: UseActiveElementReturn<HTMLDivElement>;
            };
          return useActiveElement<HTMLDivElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      mockMutationObserverObserve.mockClear();
      mockMutationObserverDisconnect.mockClear();

      rerender(target);

      expect(mockMutationObserverObserve).not.toHaveBeenCalled();
      expect(mockMutationObserverDisconnect).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const { rerender } = renderHook(
        (target) => {
          if (target)
            return useActiveElement(target) as unknown as {
              ref: StateRef<HTMLDivElement>;
            };
          return useActiveElement<HTMLDivElement>();
        },
        { initialProps: target }
      );

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById('target') });

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useActiveElement(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            value: UseActiveElementReturn<HTMLDivElement>;
          };
        return useActiveElement<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(mockMutationObserverDisconnect).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function), true);
      expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function), true);
    });
  });
});
