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

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'Control+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('Control+a', callback);
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should use hotkeys on server side', () => {
      const callback = vi.fn();
      const { result } = renderHookServer(() => {
        if (target)
          return useHotkeys(target, 'Control+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('Control+a', callback);
      });

      if (!target) expect(result.current).toBeTypeOf('function');
      if (target) expect(result.current).toBeUndefined();
    });

    it('Should call callback on matching hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'Control+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('Control+a', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Control',
            code: 'ControlLeft'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'a',
            code: 'KeyA'
          })
        );
      });

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(expect.any(KeyboardEvent));
    });

    it('Should support multiple hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(
            target,
            'Control+a, Control+b',
            callback
          ) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('Control+a, Control+b', callback);
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Control',
            code: 'ControlLeft'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'b',
            code: 'KeyB'
          })
        );
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should call prevent default on matching hotkeys', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'Control+a', callback) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('Control+a', callback);
      });

      if (!target) act(() => result.current(element));

      const firstEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Control',
        code: 'ControlLeft'
      });

      const secondEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'a',
        code: 'KeyA'
      });

      act(() => {
        element.dispatchEvent(firstEvent);
        element.dispatchEvent(secondEvent);
      });

      expect(secondEvent.defaultPrevented).toBeTruthy();
    });

    it('Should support aliases from options', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'cmd+k', callback, {
            alias: {
              Meta: 'cmd'
            }
          }) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('cmd+k', callback, {
          alias: {
            Meta: 'cmd'
          }
        });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Meta',
            code: 'MetaLeft'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'k',
            code: 'KeyK'
          })
        );
      });

      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should handle enabled option', () => {
      const callback = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

      const { result } = renderHook(() => {
        if (target)
          return useHotkeys(target, 'Control+a', callback, {
            enabled: false
          }) as unknown as StateRef<HTMLDivElement>;
        return useHotkeys<HTMLDivElement>('Control+a', callback, {
          enabled: false
        });
      });

      if (!target) act(() => result.current(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Control',
            code: 'ControlLeft'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'a',
            code: 'KeyA'
          })
        );
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
            return useHotkeys(target, 'Control+a', () => {}) as unknown as StateRef<HTMLDivElement>;
          return useHotkeys<HTMLDivElement>('Control+a', () => {});
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current(element));

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
      if (target)
        return useHotkeys(target, 'Control+a', () => {}) as unknown as StateRef<HTMLDivElement>;
      return useHotkeys<HTMLDivElement>('Control+a', () => {});
    });

    if (!target) act(() => result.current(element));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
  });
});
