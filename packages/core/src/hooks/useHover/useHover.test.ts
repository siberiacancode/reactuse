import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseHoverReturn } from './useHover';

import { useHover } from './useHover';

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
    it('Should use hover', () => {
      const { result } = renderHook(() => {
        if (target)
          return useHover(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) {
        expect(result.current.value).toBeFalsy();
        expect(result.current.ref).toBeUndefined();
      }
      if (!target) {
        expect(result.current.value).toBeFalsy();
        expect(result.current.ref).toBeTypeOf('function');
      }
    });

    it('Should use hover on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useHover(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>();
      });

      if (target) {
        expect(result.current.value).toBeFalsy();
        expect(result.current.ref).toBeUndefined();
      }
      if (!target) {
        expect(result.current.value).toBeFalsy();
        expect(result.current.ref).toBeTypeOf('function');
      }
    });

    it('Should change value on hover events', () => {
      const { result } = renderHook(() => {
        if (target)
          return useHover(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.value).toBeFalsy();
      if (!target) expect(result.current.value).toBeFalsy();

      act(() => element.dispatchEvent(new Event('mouseenter')));

      if (target) expect(result.current.value).toBeTruthy();
      if (!target) expect(result.current.value).toBeTruthy();

      act(() => element.dispatchEvent(new Event('mouseleave')));

      if (target) expect(result.current.value).toBeFalsy();
      if (!target) expect(result.current.value).toBeFalsy();
    });

    it('Should call callback on hover', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useHover(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('mouseenter')));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should call onEntry and onLeave callbacks', () => {
      const onEntry = vi.fn();
      const onLeave = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useHover(target, { onEntry, onLeave }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>({ onEntry, onLeave });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('mouseenter')));

      expect(onEntry).toHaveBeenCalledTimes(1);
      expect(onLeave).not.toHaveBeenCalled();

      act(() => element.dispatchEvent(new Event('mouseleave')));

      expect(onEntry).toHaveBeenCalledTimes(1);
      expect(onLeave).toHaveBeenCalledTimes(1);
    });

    it('Should handle enabled option', () => {
      const { result } = renderHook(() => useHover<HTMLDivElement>({ enabled: false }));

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('mouseenter')));

      expect(result.current.value).toBeFalsy();
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useHover(target) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseHoverReturn;
          return useHover<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useHover(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    });
  });
});
