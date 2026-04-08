import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useKeyboard } from './useKeyboard';

type UseKeyboardReturn = StateRef<HTMLDivElement>;

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
    it('Should use keyboard', () => {
      const { result } = renderHook(() => {
        if (target) return useKeyboard(target, () => {}) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>(() => {});
      });

      if (target) expect(result.current).toBeUndefined();
      if (!target) expect(result.current).toBeTypeOf('function');
    });

    it('Should use keyboard on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) return useKeyboard(target, () => {}) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>(() => {});
      });

      if (target) expect(result.current).toBeUndefined();
      if (!target) expect(result.current).toBeTypeOf('function');
    });

    it('Should call callback on key down', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyboard(target, callback) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should call onKeyDown option on key down', () => {
      const onKeyDown = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useKeyboard(target, {
            onKeyDown
          }) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>({ onKeyDown });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
      });

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyDown).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should call onKeyUp option on key up', () => {
      const onKeyUp = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useKeyboard(target, {
            onKeyUp
          }) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>({ onKeyUp });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Escape' }));
      });

      expect(onKeyUp).toHaveBeenCalledOnce();
      expect(onKeyUp).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should call both onKeyDown and onKeyUp options', () => {
      const onKeyDown = vi.fn();
      const onKeyUp = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useKeyboard(target, {
            onKeyDown,
            onKeyUp
          }) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>({ onKeyDown, onKeyUp });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Tab' }));
      });

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyUp).toHaveBeenCalledOnce();
    });

    it('Should pass correct key in keyboard event', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyboard(target, callback) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mock.calls[0][0].key).toBe('Enter');
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target) return useKeyboard(target, () => {}) as unknown as UseKeyboardReturn;
          return useKeyboard<HTMLDivElement>(() => {});
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(0);

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('Should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

    const { result, unmount } = renderHook(() => {
      if (target) return useKeyboard(target, () => {}) as unknown as UseKeyboardReturn;
      return useKeyboard<HTMLDivElement>(() => {});
    });

    if (!target) act(() => result.current(element));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
  });
});
