import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseContextMenuReturn } from './useContextMenu';

import { useContextMenu } from './useContextMenu';

const DEFAULT_DELAY = 500;

const createTouchEvent = (
  type: 'touchcancel' | 'touchend' | 'touchstart',
  coords?: { x: number; y: number }
) => {
  const event = new Event(type) as TouchEvent;
  const touch = {
    identifier: 1,
    clientX: coords?.x ?? 0,
    clientY: coords?.y ?? 0
  };
  const createTouchList = (values: (typeof touch)[]) =>
    Object.assign(values, {
      item: (index: number) => values[index] ?? null,
      length: values.length
    });

  const touches =
    type === 'touchend' || type === 'touchcancel' || !coords
      ? createTouchList([])
      : createTouchList([touch]);

  Object.defineProperty(event, 'touches', { value: touches });

  return event;
};

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

beforeEach(vi.useFakeTimers);

afterEach(() => {
  vi.useRealTimers();
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use context menu', () => {
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
      expect(result.current.open).toBeTypeOf('function');
      expect(result.current.close).toBeTypeOf('function');
    });

    it('Should use context menu on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useContextMenu(target) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
    });

    it('Should not subscribe when element is not resolved', () => {
      if (target) return;

      const { result } = renderHook(useContextMenu);

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
    });

    it('Should open context menu on context menu event', () => {
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      const event = new MouseEvent('contextmenu', {
        cancelable: true,
        clientX: 100,
        clientY: 200
      });

      act(() => element.dispatchEvent(event));

      expect(event.defaultPrevented).toBeTruthy();
      expect(result.current.opened).toBeTruthy();
      expect(result.current.position).toEqual({ x: 100, y: 200 });
    });

    it('Should call onOpen on context menu event', () => {
      const onOpen = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, onOpen) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>(onOpen);
      });

      if (!target) act(() => result.current.ref(element));

      const event = new MouseEvent('contextmenu', { clientX: 50, clientY: 75 });

      act(() => element.dispatchEvent(event));

      expect(onOpen).toHaveBeenCalledOnce();
      expect(onOpen).toHaveBeenCalledWith({ x: 50, y: 75 }, event);
    });

    it('Should call onStart and onEnd on interactions', () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, {
            onEnd,
            onStart
          }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onEnd, onStart });
      });

      if (!target) act(() => result.current.ref(element));

      const mouseEvent = new MouseEvent('contextmenu', { clientX: 50, clientY: 75 });

      act(() => element.dispatchEvent(mouseEvent));

      expect(onStart).toHaveBeenCalledOnce();
      expect(onStart).toHaveBeenCalledWith(mouseEvent);
      expect(onEnd).toHaveBeenCalledOnce();
      expect(onEnd).toHaveBeenCalledWith(mouseEvent);

      const touchStartEvent = createTouchEvent('touchstart', { x: 50, y: 75 });
      const touchEndEvent = createTouchEvent('touchend');

      act(() => element.dispatchEvent(touchStartEvent));
      act(() => element.dispatchEvent(touchEndEvent));

      expect(onStart).toHaveBeenCalledTimes(2);
      expect(onStart).toHaveBeenLastCalledWith(touchStartEvent);
      expect(onEnd).toHaveBeenCalledTimes(2);
      expect(onEnd).toHaveBeenLastCalledWith(touchEndEvent);
    });

    it('Should open context menu after delay on touch start', () => {
      const onOpen = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, {
            onOpen
          }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onOpen });
      });

      if (!target) act(() => result.current.ref(element));

      const event = createTouchEvent('touchstart', { x: 125, y: 250 });

      act(() => element.dispatchEvent(event));

      expect(result.current.opened).toBeFalsy();
      expect(onOpen).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));

      expect(result.current.opened).toBeTruthy();
      expect(result.current.position).toEqual({ x: 125, y: 250 });
      expect(onOpen).toHaveBeenCalledWith({ x: 125, y: 250 }, event);
    });

    it('Should respect custom delay', () => {
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, {
            delay: 1000
          }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({
          delay: 1000
        });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createTouchEvent('touchstart', { x: 10, y: 20 })));
      act(() => vi.advanceTimersByTime(999));

      expect(result.current.opened).toBeFalsy();

      act(() => vi.advanceTimersByTime(1));

      expect(result.current.opened).toBeTruthy();
    });

    it('Should cancel open on touch end', () => {
      const onEnd = vi.fn();
      const onOpen = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, { onEnd, onOpen }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onEnd, onOpen });
      });

      if (!target) act(() => result.current.ref(element));

      const event = createTouchEvent('touchend', { x: 10, y: 20 });

      act(() => element.dispatchEvent(createTouchEvent('touchstart', { x: 10, y: 20 })));
      act(() => vi.advanceTimersByTime(100));
      act(() => element.dispatchEvent(event));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));

      expect(result.current.opened).toBeFalsy();
      expect(onOpen).not.toHaveBeenCalled();
      expect(onEnd).toHaveBeenCalledOnce();
      expect(onEnd).toHaveBeenCalledWith(event);
    });

    it('Should close context menu', () => {
      const onClose = vi.fn();
      const onOpen = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, { onClose, onOpen }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onClose, onOpen });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.open({ x: 10, y: 20 }));
      expect(result.current.opened).toBeTruthy();
      expect(onOpen).not.toHaveBeenCalled();

      act(() => result.current.close());

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('Should handle enabled option', () => {
      const onOpen = vi.fn();
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, {
            enabled: false,
            onOpen
          }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({
          enabled: false,
          onOpen
        });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('contextmenu')));

      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(result.current.opened).toBeFalsy();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('Should handle enabled changes', () => {
      const onOpen = vi.fn();
      const { result, rerender } = renderHook(
        (enabled) => {
          if (target)
            return useContextMenu(target, { enabled, onOpen }) as UseContextMenuReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useContextMenu<HTMLDivElement>({ enabled, onOpen });
        },
        {
          initialProps: false
        }
      );

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('contextmenu')));
      expect(result.current.opened).toBeFalsy();
      expect(onOpen).not.toHaveBeenCalled();

      rerender(true);
      act(() => element.dispatchEvent(new MouseEvent('contextmenu', { clientX: 30, clientY: 40 })));
      expect(result.current.opened).toBeTruthy();
      expect(result.current.position).toEqual({ x: 30, y: 40 });
      expect(onOpen).toHaveBeenCalledOnce();

      act(() => result.current.close());
      rerender(false);
      act(() => element.dispatchEvent(new MouseEvent('contextmenu')));
      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
      expect(onOpen).toHaveBeenCalledOnce();
    });

    it('Should use latest callback', () => {
      const initialCallback = vi.fn();
      const callback = vi.fn();
      const { result, rerender } = renderHook(
        (callback) => {
          if (target)
            return useContextMenu(target, callback) as UseContextMenuReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useContextMenu<HTMLDivElement>(callback);
        },
        {
          initialProps: initialCallback
        }
      );

      if (!target) act(() => result.current.ref(element));

      rerender(callback);
      act(() => element.dispatchEvent(new MouseEvent('contextmenu')));

      expect(initialCallback).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledOnce();
    });

    it('Should ignore touch start without an active touch', () => {
      const onOpen = vi.fn();
      const onStart = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, { onOpen, onStart }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onOpen, onStart });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createTouchEvent('touchstart')));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
      expect(onStart).not.toHaveBeenCalled();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('Should cancel open on touch end without onEnd callback', () => {
      const onOpen = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, { onOpen }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onOpen });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createTouchEvent('touchstart', { x: 10, y: 20 })));
      act(() => vi.advanceTimersByTime(100));
      act(() => element.dispatchEvent(createTouchEvent('touchend')));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('Should cancel open on touch cancel', () => {
      const onOpen = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, { onOpen }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onOpen });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createTouchEvent('touchstart', { x: 10, y: 20 })));
      act(() => vi.advanceTimersByTime(100));
      act(() => element.dispatchEvent(createTouchEvent('touchcancel')));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));

      expect(result.current.opened).toBeFalsy();
      expect(result.current.position).toBeUndefined();
      expect(onOpen).not.toHaveBeenCalled();
    });

    it('Should handle target changes', () => {
      const nextElement = document.createElement('div');
      const { result, rerender } = renderHook(
        (currentTarget) => {
          if (currentTarget)
            return useContextMenu(currentTarget) as UseContextMenuReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useContextMenu<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      rerender({ current: nextElement });
      act(() => element.dispatchEvent(new MouseEvent('contextmenu')));
      expect(result.current.opened).toBeFalsy();

      act(() =>
        nextElement.dispatchEvent(new MouseEvent('contextmenu', { clientX: 30, clientY: 40 }))
      );
      expect(result.current.opened).toBeTruthy();
      expect(result.current.position).toEqual({ x: 30, y: 40 });
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useContextMenu(target) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));
    });
  });
});
