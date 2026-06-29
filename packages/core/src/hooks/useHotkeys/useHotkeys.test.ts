import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useHotkeys } from './useHotkeys';

const element = document.getElementById('target') as HTMLDivElement;
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

const pressCombo = (
  main: { key: string; code: string },
  modifier: { key: string; code: string } = { key: 'ctrl', code: 'ctrlLeft' }
) => {
  const modifierFlags: KeyboardEventInit = {
    ctrlKey: modifier.key === 'ctrl',
    metaKey: modifier.key === 'Meta',
    altKey: modifier.key === 'Alt',
    shiftKey: modifier.key === 'Shift'
  };

  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: modifier.key,
      code: modifier.code,
      ...modifierFlags
    })
  );

  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: main.key,
    code: main.code,
    ...modifierFlags
  });
  element.dispatchEvent(event);
  return event;
};

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'ctrl+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('ctrl+a', callback);
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should use hotkeys on server side', () => {
      const callback = vi.fn();
      const { result } = renderHookServer(() => {
        if (target)
          return useHotkeys(target, 'ctrl+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('ctrl+a', callback);
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should call callback on matching hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'ctrl+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('ctrl+a', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        pressCombo({ key: 'a', code: 'KeyA' });
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should not call callback without the required modifier', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'ctrl+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('ctrl+a', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'a',
            code: 'KeyA'
          })
        );
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it('Should support multiple hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(
            target,
            'ctrl+a, ctrl+b',
            callback
          ) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('ctrl+a, ctrl+b', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        pressCombo({ key: 'b', code: 'KeyB' });
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should support the mod modifier (ctrl on win/linux)', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'mod+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('mod+a', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        pressCombo({ key: 'a', code: 'KeyA' }, { key: 'ctrl', code: 'ctrlLeft' });
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should support the mod modifier (meta on mac)', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'mod+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('mod+a', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        pressCombo({ key: 'a', code: 'KeyA' }, { key: 'Meta', code: 'MetaLeft' });
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should support meta hotkeys via cmd alias', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'cmd+k', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('cmd+k', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        pressCombo({ key: 'k', code: 'KeyK' }, { key: 'Meta', code: 'MetaLeft' });
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should handle enabled option', () => {
      const callback = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'ctrl+a', callback, {
            enabled: false
          }) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('ctrl+a', callback, {
          enabled: false
        });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        pressCombo({ key: 'a', code: 'KeyA' });
      });

      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(callback).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useHotkeys(target, 'ctrl+a', () => {}) as unknown as StateRef<HTMLDivElement>;
          return useHotkeys<HTMLDivElement>('ctrl+a', () => {});
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('Should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

    const { result, unmount } = renderHook(() => {
      if (target)
        return useHotkeys(target, 'ctrl+a', () => {}) as unknown as StateRef<HTMLDivElement>;
      return useHotkeys<HTMLDivElement>('ctrl+a', () => {});
    });

    if (!target) act(() => result.current(element));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});
