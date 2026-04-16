import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseSwipeReturn } from './useSwipe';

import { useSwipe } from './useSwipe';

const createPointerEvent = (
  type: 'pointercancel' | 'pointerdown' | 'pointermove' | 'pointerup',
  coords: { x: number; y: number },
  pointerType: 'mouse' | 'pen' | 'touch' = 'touch'
) => {
  const event = new Event(type) as PointerEvent;

  Object.defineProperty(event, 'clientX', { value: coords.x });
  Object.defineProperty(event, 'clientY', { value: coords.y });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  Object.defineProperty(event, 'isPrimary', { value: true });

  return event;
};

const createTouchEvent = (
  type: 'touchcancel' | 'touchend' | 'touchmove' | 'touchstart',
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
  const changedTouches = createTouchList([touch]);

  Object.defineProperty(event, 'touches', { value: touches });
  Object.defineProperty(event, 'changedTouches', { value: changedTouches });

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
    it('Should use swipe', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.swiping).toBeFalsy();
      expect(result.current.snapshot.direction).toBe('none');
      expect(result.current.snapshot.lengthX).toBe(0);
      expect(result.current.snapshot.lengthY).toBe(0);
    });

    it('Should use swipe on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useSwipe(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.swiping).toBeFalsy();
      expect(result.current.snapshot.direction).toBe('none');
    });

    it('Should track touch swipe direction', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      act(() => element.dispatchEvent(createTouchEvent('touchstart', { x: 100, y: 100 })));
      expect(result.current.swiping).toBeTruthy();

      act(() => window.dispatchEvent(createTouchEvent('touchmove', { x: 20, y: 100 })));

      expect(result.current.snapshot.lengthX).toBe(80);
      expect(result.current.snapshot.direction).toBe('left');

      act(() => window.dispatchEvent(createTouchEvent('touchend', { x: 20, y: 100 })));

      expect(result.current.swiping).toBeFalsy();
      expect(result.current.snapshot.direction).toBe('left');
    });

    it('Should track pointer swipe direction', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', { x: 100, y: 100 })));
      expect(result.current.swiping).toBeTruthy();

      act(() => window.dispatchEvent(createPointerEvent('pointermove', { x: 100, y: 20 })));

      expect(result.current.snapshot.lengthY).toBe(80);
      expect(result.current.snapshot.direction).toBe('up');

      act(() => window.dispatchEvent(createPointerEvent('pointerup', { x: 100, y: 20 })));
      expect(result.current.swiping).toBeFalsy();
      expect(result.current.snapshot.direction).toBe('up');
    });

    it('Should respect threshold', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target, { threshold: 100 }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>({ threshold: 100 });
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', { x: 100, y: 100 })));
      act(() => window.dispatchEvent(createPointerEvent('pointermove', { x: 50, y: 100 })));

      expect(result.current.snapshot.lengthX).toBe(50);
      expect(result.current.snapshot.direction).toBe('none');

      act(() => window.dispatchEvent(createPointerEvent('pointerup', { x: 50, y: 100 })));
      expect(result.current.snapshot.direction).toBe('none');
    });

    it('Should call onStart handler', () => {
      const onStart = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target, {
            onStart
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>({
          onStart
        });
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      const startEvent = createTouchEvent('touchstart', { x: 100, y: 100 });

      act(() => element.dispatchEvent(startEvent));

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'none', lengthX: 0, lengthY: 0 }),
        startEvent
      );
    });

    it('Should call onEnd handler', () => {
      const onEnd = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target, {
            onEnd
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>({
          onEnd
        });
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      const startEvent = createTouchEvent('touchstart', { x: 100, y: 100 });
      const moveEvent = createTouchEvent('touchmove', { x: 20, y: 100 });
      const endEvent = createTouchEvent('touchend', { x: 20, y: 100 });

      act(() => element.dispatchEvent(startEvent));
      act(() => window.dispatchEvent(moveEvent));
      act(() => window.dispatchEvent(endEvent));

      expect(onEnd).toHaveBeenCalledTimes(1);
      expect(onEnd).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'left', lengthX: 80 }),
        endEvent
      );
    });

    it('Should call onMove handler', () => {
      const onMove = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target, {
            onMove
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>({
          onMove
        });
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      const startEvent = createTouchEvent('touchstart', { x: 100, y: 100 });
      const moveEvent = createTouchEvent('touchmove', { x: 20, y: 100 });

      act(() => element.dispatchEvent(startEvent));
      act(() => window.dispatchEvent(moveEvent));

      expect(onMove).toHaveBeenCalledTimes(1);
      expect(onMove).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'left', lengthX: 80 }),
        moveEvent
      );
    });

    it('Should support callback overload as onMove', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      const startEvent = createTouchEvent('touchstart', { x: 100, y: 100 });
      const moveEvent = createTouchEvent('touchmove', { x: 20, y: 100 });

      act(() => element.dispatchEvent(startEvent));
      act(() => window.dispatchEvent(moveEvent));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ direction: 'left', lengthX: 80 }),
        moveEvent
      );
    });

    it('Should not call onEnd without swipe start', () => {
      const onEnd = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target, { onEnd }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>({ onEnd });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => window.dispatchEvent(createTouchEvent('touchend', { x: 20, y: 100 })));

      expect(onEnd).not.toHaveBeenCalled();
    });

    it('Should handle mouse pointer by default', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSwipe(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => {
        result.current.watch();
      });

      act(() =>
        element.dispatchEvent(createPointerEvent('pointerdown', { x: 100, y: 100 }, 'mouse'))
      );
      act(() =>
        window.dispatchEvent(createPointerEvent('pointermove', { x: 10, y: 100 }, 'mouse'))
      );

      expect(result.current.swiping).toBeTruthy();
      expect(result.current.snapshot.direction).toBe('left');
      expect(result.current.snapshot.lengthX).toBe(90);
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useSwipe(target) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseSwipeReturn;
          return useSwipe<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it('Should cleanup on unmount', () => {
      const removeElementEventListenerSpy = vi.spyOn(element, 'removeEventListener');
      const removeWindowEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useSwipe(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseSwipeReturn;
        return useSwipe<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      unmount();

      expect(removeElementEventListenerSpy).toHaveBeenCalledWith(
        'pointerdown',
        expect.any(Function)
      );
      expect(removeElementEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function)
      );

      expect(removeWindowEventListenerSpy).toHaveBeenCalledWith(
        'pointermove',
        expect.any(Function)
      );
      expect(removeWindowEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(removeWindowEventListenerSpy).toHaveBeenCalledWith(
        'pointercancel',
        expect.any(Function)
      );
      expect(removeWindowEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeWindowEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeWindowEventListenerSpy).toHaveBeenCalledWith(
        'touchcancel',
        expect.any(Function)
      );
    });
  });
});
