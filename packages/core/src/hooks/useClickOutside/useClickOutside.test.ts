import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useClickOutside } from './useClickOutside';

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
    it('Should use click outside', () => {
      const { result } = renderHook(() => {
        if (target)
          return useClickOutside(target, vi.fn()) as unknown as {
            ref: StateRef<HTMLDivElement>;
          };
        return useClickOutside(vi.fn());
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should use click outside on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useClickOutside(target, vi.fn()) as unknown as {
            ref: StateRef<HTMLDivElement>;
          };
        return useClickOutside(vi.fn());
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should call callback when clicked outside', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useClickOutside(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          };
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current.ref(element));

      expect(callback).not.toBeCalled();

      act(() => document.dispatchEvent(new Event('click')));

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should not call callback when clicked inside', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useClickOutside(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          };
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('click')));

      expect(callback).not.toBeCalled();
    });

    it('Should disconnect on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const callback = vi.fn();
      document.body.appendChild(element);

      const { result, unmount } = renderHook(() => {
        if (target)
          return useClickOutside(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          };
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('Should handle target changes', () => {
    const callback = vi.fn();
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { result, rerender } = renderHook(
      (target) => {
        if (target)
          return useClickOutside(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          };
        return useClickOutside(callback);
      },
      {
        initialProps: target
      }
    );

    if (!target) act(() => result.current.ref(element));

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).not.toHaveBeenCalled();

    rerender({ current: document.getElementById('target') });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('Should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const callback = vi.fn();

    const { result, unmount } = renderHook(() => {
      if (target)
        return useClickOutside(target, callback) as unknown as {
          ref: StateRef<HTMLDivElement>;
        };
      return useClickOutside(callback);
    });

    if (!target) act(() => result.current.ref(element));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
