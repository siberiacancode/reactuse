import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseFocusTrapReturn } from './useFocusTrap';

import { useFocusTrap } from './useFocusTrap';

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

const createFocusableElements = () => {
  element.innerHTML = '';

  const first = document.createElement('input');
  first.type = 'text';
  first.textContent = 'first';
  first.setAttribute('data-autofocus', '');

  const last = document.createElement('input');
  last.type = 'text';
  last.textContent = 'last';

  element.append(first, last);

  return { first, last };
};

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use focus trap', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, false) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(false);
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.active).toBeFalsy();
      expect(result.current.enable).toBeTypeOf('function');
      expect(result.current.disable).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
    });

    it('Should use focus trap on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useFocusTrap(target, false) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(false);
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.active).toBeFalsy();
      expect(result.current.enable).toBeTypeOf('function');
      expect(result.current.disable).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
    });

    it('Should focus autofocus element on enable', () => {
      const { first } = createFocusableElements();
      const autofocusFocusSpy = vi.spyOn(first, 'focus');

      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, true) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));

      expect(autofocusFocusSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(first);
    });

    it('Should cycle focus to first element on tab', () => {
      const { first, last } = createFocusableElements();

      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, true) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));

      last.focus();
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', cancelable: true }));
      });

      expect(document.activeElement).toBe(first);
    });

    it('Should cycle focus to last element on shift tab', () => {
      const { first, last } = createFocusableElements();

      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, true) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));

      first.focus();
      act(() => {
        document.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true })
        );
      });

      expect(document.activeElement).toBe(last);
    });

    it('Should enable focus trap', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, false) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(false);
      });

      expect(result.current.active).toBeFalsy();

      act(() => result.current.enable());
      expect(result.current.active).toBeTruthy();
    });

    it('Should disable focus trap', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, true) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(true);
      });

      expect(result.current.active).toBeTruthy();

      act(() => result.current.disable());
      expect(result.current.active).toBeFalsy();
    });

    it('Should toggle focus trap', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocusTrap(target, false) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(false);
      });

      expect(result.current.active).toBeFalsy();

      act(() => result.current.toggle());
      expect(result.current.active).toBeTruthy();

      act(() => result.current.toggle());
      expect(result.current.active).toBeFalsy();
    });

    it('Should handle target changes', () => {
      createFocusableElements();

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useFocusTrap(target, true) as UseFocusTrapReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useFocusTrap<HTMLDivElement>(true);
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledOnce();
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.body });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledOnce();
    });

    it('Should cleanup on unmount', () => {
      createFocusableElements();

      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useFocusTrap(target, true) as UseFocusTrapReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocusTrap<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
