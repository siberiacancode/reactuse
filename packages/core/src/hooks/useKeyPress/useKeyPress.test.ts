import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import { useKeyPress } from './useKeyPress';

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
    it('Should use key press', () => {
      const { result } = renderHook(() => {
        if (target) return useKeyPress(target, 'Enter');
        return useKeyPress<HTMLDivElement>('Enter');
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.pressed).toBeFalsy();
    });

    it('Should use key press on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) return useKeyPress(target, 'Enter');
        return useKeyPress<HTMLDivElement>('Enter');
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.pressed).toBeFalsy();
    });

    it('Should set pressed true on matching key down', () => {
      const { result } = renderHook(() => {
        if (target) return useKeyPress(target, 'Enter');
        return useKeyPress<HTMLDivElement>('Enter');
      });

      if (!target && result.current.ref) act(() => result.current.ref?.(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      });

      expect(result.current.pressed).toBeTruthy();
    });

    it('Should set pressed false on matching key up', () => {
      const { result } = renderHook(() => {
        if (target) return useKeyPress(target, 'Enter');
        return useKeyPress<HTMLDivElement>('Enter');
      });

      if (!target && result.current.ref) act(() => result.current.ref?.(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
      });

      expect(result.current.pressed).toBeFalsy();
    });

    it('Should call callback on matching key events', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyPress(target, 'Enter', callback);
        return useKeyPress<HTMLDivElement>('Enter', callback);
      });

      if (!target && result.current.ref) act(() => result.current.ref?.(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
      });

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, true, expect.any(KeyboardEvent));
      expect(callback).toHaveBeenNthCalledWith(2, false, expect.any(KeyboardEvent));
    });

    it('Should support key arrays', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyPress(target, ['Enter', 'Escape'], callback);
        return useKeyPress<HTMLDivElement>(['Enter', 'Escape'], callback);
      });

      if (!target && result.current.ref) act(() => result.current.ref?.(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
      });

      expect(result.current.pressed).toBeTruthy();
      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(true, expect.any(KeyboardEvent));
    });

    it('Should not react on non matching key', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyPress(target, 'Enter', callback);
        return useKeyPress<HTMLDivElement>('Enter', callback);
      });

      if (!target && result.current.ref) act(() => result.current.ref?.(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
      });

      expect(result.current.pressed).toBeFalsy();
      expect(callback).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target) return useKeyPress(target, 'Enter');
          return useKeyPress<HTMLDivElement>('Enter');
        },
        {
          initialProps: target
        }
      );

      if (!target && result.current.ref) act(() => result.current.ref?.(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('Should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

    const { result, unmount } = renderHook(() => {
      if (target) return useKeyPress(target, 'Enter');
      return useKeyPress<HTMLDivElement>('Enter');
    });

    if (!target && result.current.ref) act(() => result.current.ref?.(element));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
  });
});
