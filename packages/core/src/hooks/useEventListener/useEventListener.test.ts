import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { target } from '@/utils/helpers';

import type { UseEventListenerReturn } from './useEventListener';

import { renderHookServer } from '../../../tests/renderHookServer';
import { useEventListener } from './useEventListener';

afterEach(vi.clearAllMocks);

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') }
];

const element = document.getElementById('target') as HTMLDivElement;

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use event listener', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useEventListener(
            target,
            'click',
            callback
          ) as unknown as UseEventListenerReturn<HTMLDivElement>;
        return useEventListener('click', callback);
      });

      if (!target) act(() => result.current(element));

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should use event listener on server side', () => {
      const listener = vi.fn();

      const { result } = renderHookServer(() => {
        if (target)
          return useEventListener(
            target,
            'click',
            listener
          ) as unknown as UseEventListenerReturn<HTMLDivElement>;
        return useEventListener('click', listener);
      });

      if (!target) act(() => result.current(element));

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should call listener when event is triggered', () => {
      const listener = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useEventListener(
            target,
            'click',
            listener
          ) as unknown as UseEventListenerReturn<HTMLDivElement>;
        return useEventListener('click', listener);
      });

      if (!target) act(() => result.current(element));

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();

      act(() => element.dispatchEvent(new Event('click')));

      expect(listener).toHaveBeenCalled();
    });

    it('Should handle enabled option', () => {
      const listener = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useEventListener(target, 'click', listener, {
            enabled: false
          }) as unknown as UseEventListenerReturn<HTMLDivElement>;
        return useEventListener('click', listener, { enabled: false });
      });

      if (!target) act(() => result.current(element));

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();

      act(() => element.dispatchEvent(new Event('click')));

      expect(listener).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const listener = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useEventListener(
              target,
              'click',
              listener
            ) as unknown as UseEventListenerReturn<HTMLDivElement>;
          return useEventListener<HTMLDivElement>('click', listener);
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current(element));

      expect(addEventListenerSpy).toHaveBeenCalledOnce();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    });

    it('Should disconnect observer on unmount', () => {
      const listener = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useEventListener(
            target,
            'click',
            listener
          ) as unknown as UseEventListenerReturn<HTMLDivElement>;
        return useEventListener<HTMLDivElement>('click', listener);
      });

      if (!target) act(() => result.current(element));

      unmount();

      expect(addEventListenerSpy).toHaveBeenCalledOnce();
      expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    });
  });
});
