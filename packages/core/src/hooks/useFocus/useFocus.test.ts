import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseFocusReturn } from './useFocus';

import { useFocus } from './useFocus';

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
  element.matches = vi.fn().mockReturnValue(true);
});
targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use focus', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocus(target) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.focused).toBeFalsy();
      expect(result.current.focus).toBeTypeOf('function');
      expect(result.current.blur).toBeTypeOf('function');
    });

    it('Should use focus on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useFocus(target) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.focused).toBeFalsy();
      expect(result.current.focus).toBeTypeOf('function');
      expect(result.current.blur).toBeTypeOf('function');
    });

    it('Should change focused on focus events', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocus(target) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.focused).toBeFalsy();

      act(() => element.dispatchEvent(new FocusEvent('focus')));

      expect(result.current.focused).toBeTruthy();

      act(() => element.dispatchEvent(new FocusEvent('blur')));

      expect(result.current.focused).toBeFalsy();
    });

    it('Should handle enabled option', () => {
      const { result } = renderHook(() => {
        if (target)
          return useFocus(target, { enabled: false }) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>({ enabled: false });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new FocusEvent('focus')));

      expect(result.current.focused).toBeFalsy();

      act(() => element.dispatchEvent(new FocusEvent('blur')));

      expect(result.current.focused).toBeFalsy();
    });

    it('Should call onFocus callback', () => {
      const onFocus = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useFocus(target, { onFocus }) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>({ onFocus });
      });

      if (!target) act(() => result.current.ref(element));

      const focusEvent = new FocusEvent('focus');
      act(() => element.dispatchEvent(focusEvent));

      expect(onFocus).toHaveBeenCalledOnce();
      expect(onFocus).toHaveBeenCalledWith(focusEvent);
    });

    it('Should call onBlur callback', () => {
      const onBlur = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useFocus(target, { onBlur }) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>({ onBlur });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new FocusEvent('focus')));

      const blurEvent = new FocusEvent('blur');
      act(() => element.dispatchEvent(blurEvent));

      expect(onBlur).toHaveBeenCalledOnce();
      expect(onBlur).toHaveBeenCalledWith(blurEvent);
    });

    it('Should handle initial value', () => {
      element.focus = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useFocus(target, { initialValue: true }) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>({ initialValue: true });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.focused).toBeTruthy();
      expect(element.focus).toHaveBeenCalledOnce();
    });

    it('Should call callback on focus', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useFocus(target, callback) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new FocusEvent('focus')));

      expect(callback).toHaveBeenCalledOnce();
      expect(result.current.focused).toBeTruthy();
    });

    it('Should programmatically focus element', () => {
      element.focus = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useFocus(target) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.focus());

      expect(element.focus).toHaveBeenCalledOnce();
      expect(result.current.focused).toBeTruthy();
    });

    it('Should programmatically blur element', () => {
      const mockBlur = vi.fn();
      element.blur = mockBlur;

      const { result } = renderHook(() => {
        if (target)
          return useFocus(target) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.blur());

      expect(mockBlur).toHaveBeenCalledOnce();
    });

    it('Should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useFocus(target) as UseFocusReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useFocus<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('focus', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('blur', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
