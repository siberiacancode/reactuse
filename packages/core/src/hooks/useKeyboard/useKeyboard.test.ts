import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { renderHookServer } from '../../../tests/renderHookServer';
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

      if (!target) act(() => (result.current as UseKeyboardReturn)(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should call onKeyDown option on key down', () => {
      const onKeyDown = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyboard(target, { onKeyDown }) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>({ onKeyDown });
      });

      if (!target) act(() => (result.current as UseKeyboardReturn)(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }));
      });

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyDown).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should call onKeyUp option on key up', () => {
      const onKeyUp = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyboard(target, { onKeyUp }) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>({ onKeyUp });
      });

      if (!target) act(() => (result.current as UseKeyboardReturn)(element));

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
          return useKeyboard(target, { onKeyDown, onKeyUp }) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>({ onKeyDown, onKeyUp });
      });

      if (!target) act(() => (result.current as UseKeyboardReturn)(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Tab' }));
      });

      expect(onKeyDown).toHaveBeenCalledOnce();
      expect(onKeyUp).toHaveBeenCalledOnce();
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target) return useKeyboard(target, () => {}) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>(() => {});
      });

      if (!target) act(() => (result.current as UseKeyboardReturn)(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
    });

    it('Should pass correct key in keyboard event', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useKeyboard(target, callback) as unknown as UseKeyboardReturn;
        return useKeyboard<HTMLDivElement>(callback);
      });

      if (!target) act(() => (result.current as UseKeyboardReturn)(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mock.calls[0][0].key).toBe('Enter');
    });

    it('Should attach listener to window when no target provided', () => {
      const callback = vi.fn();

      renderHook(() => useKeyboard(callback));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should update options after rerender', () => {
      if (target) return;

      const onKeyDown1 = vi.fn();
      const onKeyDown2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ handler }) => useKeyboard<HTMLDivElement>({ onKeyDown: handler }),
        { initialProps: { handler: onKeyDown1 } }
      );

      act(() => (result.current as unknown as UseKeyboardReturn)(element));

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      });

      expect(onKeyDown1).toHaveBeenCalledOnce();

      rerender({ handler: onKeyDown2 });

      act(() => {
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      });

      expect(onKeyDown2).toHaveBeenCalledOnce();
    });
  });
});
