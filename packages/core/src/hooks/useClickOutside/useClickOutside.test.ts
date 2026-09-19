import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target, targetSymbol } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useClickOutside } from './useClickOutside';

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target') as HTMLDivElement),
  target(() => document.getElementById('target') as HTMLDivElement),
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
        if (target) return useClickOutside(target, vi.fn()) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(vi.fn());
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should use click outside on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) return useClickOutside(target, vi.fn()) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(vi.fn());
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should call callback when clicked outside', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      expect(callback).not.toHaveBeenCalled();

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should not call callback when clicked inside', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      act(() => element.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).not.toHaveBeenCalled();
    });

    it('Should subscribe once on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('Should not subscribe when element is not resolved', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useClickOutside(
            { value: '#missing', type: targetSymbol },
            callback
          ) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) expect(result.current).toBeTypeOf('function');

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('click', expect.any(Function));

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).not.toHaveBeenCalled();
    });

    it('Should use latest callback', () => {
      const initialCallback = vi.fn();
      const callback = vi.fn();

      const { result, rerender } = renderHook(
        (callback) => {
          if (target)
            return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
          return useClickOutside(callback);
        },
        {
          initialProps: initialCallback
        }
      );

      if (!target) act(() => result.current(element));

      rerender(callback);

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(initialCallback).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should not call callback when disabled', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useClickOutside(target, callback, {
            enabled: false
          }) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback, { enabled: false });
      });

      if (!target) act(() => result.current(element));

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).not.toHaveBeenCalled();
    });

    it('Should handle enabled changes', () => {
      const callback = vi.fn();

      const { result, rerender } = renderHook(
        (enabled) => {
          if (target)
            return useClickOutside(target, callback, {
              enabled
            }) as unknown as StateRef<HTMLDivElement>;
          return useClickOutside(callback, { enabled });
        },
        {
          initialProps: false
        }
      );

      if (!target) act(() => result.current(element));

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).not.toHaveBeenCalled();

      rerender(true);

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).toHaveBeenCalledOnce();

      rerender(false);

      act(() => document.dispatchEvent(new MouseEvent('click', { bubbles: true })));

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should recreate effect', () => {
      const callback = vi.fn();
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
          return useClickOutside(callback);
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current(element));

      expect(addEventListenerSpy).toHaveBeenCalledOnce();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      const callback = vi.fn();

      const { result, unmount } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledOnce();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });
});
