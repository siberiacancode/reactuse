import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseDraggableReturn } from './useDraggable';

import { useDraggable } from './useDraggable';

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

const createPointerEvent = (type: string, clientX: number, clientY: number) => {
  const event = new Event(type, { bubbles: true }) as PointerEvent;
  Object.defineProperty(event, 'clientX', { value: clientX });
  Object.defineProperty(event, 'clientY', { value: clientY });
  Object.defineProperty(event, 'button', { value: 0 });
  return event;
};

beforeEach(() => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 50,
    width: 200,
    height: 100,
    right: 300,
    bottom: 150,
    x: 100,
    y: 50,
    toJSON: () => {}
  });
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use draggable', () => {
      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.snapshot.x).toBe(0);
      expect(result.current.snapshot.y).toBe(0);
      expect(result.current.dragging).toBe(false);
      expect(result.current.set).toBeTypeOf('function');
      expect(result.current.watch).toBeTypeOf('function');
    });

    it('Should use draggable on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useDraggable(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.snapshot.x).toBe(0);
      expect(result.current.snapshot.y).toBe(0);
      expect(result.current.dragging).toBe(false);
      expect(result.current.set).toBeTypeOf('function');
      expect(result.current.watch).toBeTypeOf('function');
    });

    it('Should apply initial value', () => {
      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target, { initialValue: { x: 10, y: 20 } }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>({ initialValue: { x: 10, y: 20 } });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.snapshot.x).toBe(10);
      expect(result.current.snapshot.y).toBe(20);
    });

    it('Should set dragging', () => {
      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.dragging).toBe(false);

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      expect(result.current.dragging).toBe(true);

      act(() => document.dispatchEvent(createPointerEvent('pointerup', 120, 80)));
      expect(result.current.dragging).toBe(false);
    });

    it('Should call onStart on pointer down', () => {
      const onStart = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target, { onStart }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>({ onStart });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));

      expect(onStart).toHaveBeenCalledOnce();
      expect(onStart).toHaveBeenCalledWith(
        expect.objectContaining({
          position: { x: 0, y: 0 },
          delta: { x: 0, y: 0 },
          event: expect.any(Event)
        })
      );
    });

    it('Should not start dragging when onStart returns false', () => {
      const onMove = vi.fn();

      const { result } = renderHook(() => {
        const options = { onStart: () => false as const, onMove };
        if (target)
          return useDraggable(target, options) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>(options);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      expect(result.current.dragging).toBe(false);

      act(() => document.dispatchEvent(createPointerEvent('pointermove', 200, 160)));
      expect(onMove).not.toHaveBeenCalled();
    });

    it('Should call onMove with position and delta', () => {
      const onMove = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target, { onMove }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>({ onMove });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      act(() => document.dispatchEvent(createPointerEvent('pointermove', 170, 130)));

      expect(onMove).toHaveBeenCalledWith(
        expect.objectContaining({
          position: { x: 150, y: 100 },
          delta: { x: 50, y: 50 },
          event: expect.any(Event)
        })
      );
    });

    it('Should call onEnd on pointer up', () => {
      const onEnd = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target, { onEnd }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>({ onEnd });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      act(() => document.dispatchEvent(createPointerEvent('pointermove', 170, 130)));
      act(() => document.dispatchEvent(createPointerEvent('pointerup', 170, 130)));

      expect(onEnd).toHaveBeenCalledOnce();
      expect(onEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          delta: { x: 50, y: 50 },
          event: expect.any(Event)
        })
      );
    });

    it('Should reset delta on second drag', () => {
      const onMove = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target, { onMove }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>({ onMove });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      act(() => document.dispatchEvent(createPointerEvent('pointermove', 220, 180)));
      act(() => document.dispatchEvent(createPointerEvent('pointerup', 220, 180)));

      onMove.mockClear();

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      act(() => document.dispatchEvent(createPointerEvent('pointermove', 130, 90)));

      expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ delta: { x: 10, y: 10 } }));
    });

    it('Should respect axis option', () => {
      const onMove = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target, { axis: 'x', onMove }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>({ axis: 'x', onMove });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      act(() => document.dispatchEvent(createPointerEvent('pointermove', 170, 130)));

      expect(onMove).toHaveBeenCalledWith(expect.objectContaining({ position: { x: 150, y: 0 } }));
    });

    it('Should set position', () => {
      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.set({ x: 42, y: 24 }));

      expect(result.current.snapshot.x).toBe(42);
      expect(result.current.snapshot.y).toBe(24);
    });

    it('Should return reactive value on watch', () => {
      const { result } = renderHook(() => {
        if (target)
          return useDraggable(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.watch());

      act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
      act(() => document.dispatchEvent(createPointerEvent('pointermove', 170, 130)));

      expect(result.current.snapshot.x).toBe(150);
      expect(result.current.snapshot.y).toBe(100);
    });
  });

  it('Should handle enabled option', () => {
    const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

    const { result } = renderHook(() => useDraggable<HTMLDivElement>({ enabled: false }));

    act(() => result.current.ref(element));

    expect(addEventListenerSpy).not.toHaveBeenCalledWith('pointerdown', expect.any(Function));

    act(() => element.dispatchEvent(createPointerEvent('pointerdown', 120, 80)));
    expect(result.current.dragging).toBe(false);
  });

  it('Should handle target changes', () => {
    const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

    const { result, rerender } = renderHook(
      (target) => {
        if (target)
          return useDraggable(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseDraggableReturn;
        return useDraggable<HTMLDivElement>();
      },
      { initialProps: target }
    );

    if (!target) act(() => result.current.ref(element));

    const initialAddCalls = addEventListenerSpy.mock.calls.length;
    const initialRemoveCalls = removeEventListenerSpy.mock.calls.length;

    rerender({ current: document.getElementById('target') });

    expect(addEventListenerSpy.mock.calls.length).toBeGreaterThan(initialAddCalls);
    expect(removeEventListenerSpy.mock.calls.length).toBeGreaterThan(initialRemoveCalls);
  });

  it('Should cleanup on unmount', () => {
    const elementRemoveEventListenerSpy = vi.spyOn(element, 'removeEventListener');
    const documentRemoveEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { result, unmount } = renderHook(() => {
      if (target)
        return useDraggable(target) as unknown as {
          ref: StateRef<HTMLDivElement>;
        } & UseDraggableReturn;
      return useDraggable<HTMLDivElement>();
    });

    if (!target) act(() => result.current.ref(element));

    unmount();

    expect(elementRemoveEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
    expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith(
      'pointermove',
      expect.any(Function)
    );
    expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
  });
});
