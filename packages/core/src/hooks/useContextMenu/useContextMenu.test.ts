import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseContextMenuReturn } from './useContextMenu';

import { useContextMenu } from './useContextMenu';

const DEFAULT_DELAY = 500;

const createTouchEvent = (
  type: 'touchcancel' | 'touchend' | 'touchstart',
  coords: { x: number; y: number }
) => {
  const event = new Event(type) as TouchEvent;
  const touch = {
    identifier: 1,
    clientX: coords.x,
    clientY: coords.y
  };
  const createTouchList = (values: (typeof touch)[]) =>
    Object.assign(values, {
      item: (index: number) => values[index] ?? null,
      length: values.length
    });

  const touches =
    type === 'touchend' || type === 'touchcancel' ? createTouchList([]) : createTouchList([touch]);

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

targets.forEach((target) => {
  describe(`${target}`, () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

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

    it('Should open context menu on context menu event', () => {
      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      const event = new MouseEvent('contextmenu', { clientX: 100, clientY: 200 });

      act(() => element.dispatchEvent(event));

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

    it('Should call onStart and onEnd on context menu event', () => {
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

      const event = new MouseEvent('contextmenu', { clientX: 50, clientY: 75 });

      act(() => element.dispatchEvent(event));

      expect(onStart).toHaveBeenCalledOnce();
      expect(onStart).toHaveBeenCalledWith(event);
      expect(onEnd).toHaveBeenCalledOnce();
      expect(onEnd).toHaveBeenCalledWith(event);
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

      const { result } = renderHook(() => {
        if (target)
          return useContextMenu(target, { onClose }) as UseContextMenuReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useContextMenu<HTMLDivElement>({ onClose });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.open({ x: 10, y: 20 }));
      expect(result.current.opened).toBeTruthy();

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

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useContextMenu(target) as UseContextMenuReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useContextMenu<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(8);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(4);
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
