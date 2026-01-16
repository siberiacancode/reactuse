import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseMutationObserverReturn } from './useMutationObserver';

import { useMutationObserver } from './useMutationObserver';

const trigger = createTrigger<Element, MutationCallback>();

const createMockMutationRecord = (type: MutationRecordType = 'childList'): MutationRecord => ({
  type,
  target: document.getElementById('target') as HTMLDivElement,
  addedNodes: NodeList.prototype as NodeList,
  removedNodes: NodeList.prototype as NodeList,
  previousSibling: null,
  nextSibling: null,
  attributeName: null,
  attributeNamespace: null,
  oldValue: null
});

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
    it('Should use mutation observer', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMutationObserver(target) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useMutationObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.observer).toBeInstanceOf(MockMutationObserver);
    });

    it('Should use mutation observer on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useMutationObserver(target) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useMutationObserver<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.observer).toBeUndefined();
    });

    it('Should observe element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMutationObserver(target) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };

        return useMutationObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);
      expect(mockMutationObserverObserve).toHaveBeenCalledWith(element, expect.any(Object));
    });

    it('Should call onChange callback when mutation occurs', () => {
      const onChange = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useMutationObserver(target, {
            onChange
          }) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useMutationObserver<HTMLDivElement>({ onChange });
      });

      if (!target) act(() => result.current.ref(element));

      const mutationRecord = createMockMutationRecord('childList');
      act(() => trigger.callback(element, [mutationRecord], result.current.observer!));

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith([mutationRecord], result.current.observer);
    });

    it('Should call callback on mutation', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useMutationObserver(target, callback) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useMutationObserver<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      const mutationRecord = createMockMutationRecord('childList');
      act(() => trigger.callback(element, [mutationRecord], result.current.observer!));

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith([mutationRecord], result.current.observer);
    });

    it('Should handle mutation observer options', () => {
      const options = {
        childList: true,
        attributes: true,
        subtree: true,
        characterData: true
      };

      const { result } = renderHook(() => {
        if (target)
          return useMutationObserver(target, options) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useMutationObserver<HTMLDivElement>(options);
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockMutationObserverObserve).toHaveBeenCalledWith(element, options);
    });

    it('Should handle enabled option', () => {
      const { result } = renderHook(() => useMutationObserver<HTMLDivElement>({ enabled: false }));

      act(() => result.current.ref(element));

      expect(mockMutationObserverObserve).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useMutationObserver(target) as UseMutationObserverReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useMutationObserver<HTMLDivElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById('target') });

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it('Should disconnect observer on unmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target)
          return useMutationObserver(target) as UseMutationObserverReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useMutationObserver<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(mockMutationObserverDisconnect).toHaveBeenCalledOnce();
    });
  });
});
