import { act, renderHook } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { isTarget, target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseFullScreenReturn } from './useFullscreen';

import { useFullscreen } from './useFullscreen';

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

beforeEach(() => {
  Object.defineProperty(document, 'fullscreenElement', {
    value: null,
    writable: true,
    configurable: true
  });

  document.exitFullscreen = vi.fn().mockResolvedValue(undefined) as typeof document.exitFullscreen;
  element.requestFullscreen = vi.fn().mockResolvedValue(undefined);
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use fullscreen', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      expect(result.current.value).toBeFalsy();
      expect(result.current.enter).toBeTypeOf('function');
      expect(result.current.exit).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should use fullscreen on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      expect(result.current.value).toBeFalsy();
      expect(result.current.enter).toBeTypeOf('function');
      expect(result.current.exit).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should handle enter', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      await act(result.current.enter);

      const element = (
        target ? isTarget.getElement(target) : result.current.ref.current
      ) as Element;
      expect(element.requestFullscreen).toHaveBeenCalledTimes(1);
    });

    it('Should not enter fullscreen without target', async () => {
      if (target) return;

      const { result } = renderHook(() => useFullscreen<HTMLDivElement>());

      await act(result.current.enter);

      expect(element.requestFullscreen).not.toHaveBeenCalled();
    });

    it('Should not subscribe when element is not resolved', () => {
      if (target) return;

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useFullscreen<HTMLDivElement>());

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'fullscreenchange',
        expect.any(Function)
      );
    });

    it('Should handle exit', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      await act(result.current.exit);
      expect(document.exitFullscreen).not.toHaveBeenCalled();

      (document as any).fullscreenElement = element;
      await act(result.current.exit);

      expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    });

    it('Should toggle fullscreen', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      await act(result.current.toggle);
      const element = (
        target ? isTarget.getElement(target) : result.current.ref.current
      ) as Element;
      expect(element.requestFullscreen).toHaveBeenCalledTimes(1);

      (document as any).fullscreenElement = element;
      await act(result.current.toggle);

      expect(element.requestFullscreen).toHaveBeenCalledTimes(1);
      expect(document.exitFullscreen).toHaveBeenCalledTimes(1);
    });

    it('Should call onEnter callback', () => {
      const onEnter = vi.fn();

      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target, {
            onEnter
          }) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>({
          onEnter
        });
      });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      act(() => {
        (document as any).fullscreenElement = element;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeTruthy();
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('Should call onExit callback', () => {
      const onExit = vi.fn();

      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target, {
            initialValue: true,
            onExit
          }) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>({
          initialValue: true,
          onExit
        });
      });

      if (!target)
        act(() => result.current.ref(document.getElementById('target')! as HTMLDivElement));

      act(() => {
        (document as any).fullscreenElement = null;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeFalsy();
      expect(onExit).toHaveBeenCalledTimes(1);
    });

    it('Should ignore fullscreen changes from other elements', () => {
      const onEnter = vi.fn();
      const onExit = vi.fn();

      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target, { onEnter, onExit }) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>({ onEnter, onExit });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        (document as any).fullscreenElement = document.body;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeFalsy();
      expect(onEnter).toHaveBeenCalledTimes(0);
      expect(onExit).toHaveBeenCalledTimes(0);
    });

    it('Should change value on fullscreen events', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        (document as any).fullscreenElement = element;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeTruthy();

      act(() => {
        (document as any).fullscreenElement = null;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeFalsy();
    });

    it('Should change value on fullscreen events with empty options', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useFullscreen(target, {}) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>({});
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        (document as any).fullscreenElement = element;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeTruthy();

      act(() => {
        (document as any).fullscreenElement = null;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeFalsy();
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (nextTarget) => {
          if (nextTarget)
            return useFullscreen(nextTarget) as unknown as UseFullScreenReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useFullscreen<HTMLDivElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      rerender({ current: document.body });

      act(() => {
        (document as any).fullscreenElement = element;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeFalsy();

      act(() => {
        (document as any).fullscreenElement = document.body;
        document.dispatchEvent(new Event('fullscreenchange'));
      });

      expect(result.current.value).toBeTruthy();
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target) {
          return useFullscreen(target) as unknown as UseFullScreenReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        }

        return useFullscreen<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    });
  });
});
