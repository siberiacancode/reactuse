import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseInfiniteScrollReturn } from './useInfiniteScroll';

import { useInfiniteScroll } from './useInfiniteScroll';

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

beforeEach(() => {
  Object.defineProperty(element, 'clientWidth', {
    value: 200,
    configurable: true
  });
  Object.defineProperty(element, 'clientHeight', {
    value: 200,
    configurable: true
  });
  Object.defineProperty(element, 'scrollWidth', {
    value: 1000,
    configurable: true
  });
  Object.defineProperty(element, 'scrollHeight', {
    value: 1000,
    configurable: true
  });
  Object.defineProperty(element, 'scrollLeft', {
    value: 0,
    writable: true,
    configurable: true
  });
  Object.defineProperty(element, 'scrollTop', {
    value: 0,
    writable: true,
    configurable: true
  });
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use infinite scroll', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useInfiniteScroll(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseInfiniteScrollReturn;
        return useInfiniteScroll<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.loading).toBeFalsy();
    });

    it('Should use infinite scroll on server side', () => {
      const callback = vi.fn();
      const { result } = renderHookServer(() => {
        if (target)
          return useInfiniteScroll(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseInfiniteScrollReturn;
        return useInfiniteScroll<HTMLDivElement>(callback);
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.loading).toBeFalsy();
    });

    it('Should call callback when reaches bottom distance', async () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useInfiniteScroll(target, callback, { distance: 10 }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseInfiniteScrollReturn;
        return useInfiniteScroll<HTMLDivElement>(callback, { distance: 10 });
      });

      if (!target) act(() => result.current.ref(element));

      await act(async () => {
        element.scrollTop = 780;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(callback).not.toHaveBeenCalled();

      await act(async () => {
        element.scrollTop = 790;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.any(Event));
    });

    it('Should handle direction option', async () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useInfiniteScroll(target, callback, {
            direction: 'top',
            distance: 10
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseInfiniteScrollReturn;
        return useInfiniteScroll<HTMLDivElement>(callback, {
          direction: 'top',
          distance: 10
        });
      });

      if (!target) act(() => result.current.ref(element));

      await act(async () => {
        element.scrollTop = 9;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should block parallel callback calls while loading', async () => {
      let resolve: () => void;
      const callback = vi.fn(
        () =>
          new Promise<void>((r) => {
            resolve = r;
          })
      );

      const { result } = renderHook(() => {
        if (target)
          return useInfiniteScroll(target, callback, { distance: 10 }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseInfiniteScrollReturn;
        return useInfiniteScroll<HTMLDivElement>(callback, { distance: 10 });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.scrollTop = 790;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.loading).toBeTruthy();
      expect(callback).toHaveBeenCalledOnce();

      act(() => {
        element.scrollTop = 790;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(callback).toHaveBeenCalledOnce();

      await act(async () => resolve!());

      await waitFor(() => expect(result.current.loading).toBeFalsy());
    });

    it('Should handle target changes', () => {
      const callback = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useInfiniteScroll(target, callback) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseInfiniteScrollReturn;
          return useInfiniteScroll<HTMLDivElement>(callback);
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('Should cleanup on unmount', () => {
      const callback = vi.fn();
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useInfiniteScroll(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseInfiniteScrollReturn;
        return useInfiniteScroll<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});
