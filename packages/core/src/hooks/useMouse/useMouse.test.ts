import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseMouseReturn } from './useMouse';

import { useMouse } from './useMouse';

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
    it('Should use mouse', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMouse(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseMouseReturn;
        return useMouse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.snapshot.x).toBe(0);
      expect(result.current.snapshot.y).toBe(0);
      expect(result.current.watch).toBeTypeOf('function');
    });

    it('Should use mouse on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useMouse(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseMouseReturn;
        return useMouse<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.snapshot.x).toBe(0);
      expect(result.current.snapshot.y).toBe(0);
      expect(result.current.watch).toBeTypeOf('function');
    });

    it('Should call callback on mouse move', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useMouse(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseMouseReturn;
        return useMouse<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        const event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 120,
          clientY: 80
        });

        Object.defineProperty(event, 'pageX', { value: 120 });
        Object.defineProperty(event, 'pageY', { value: 80 });
        document.dispatchEvent(event);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 120,
          y: 80,
          clientX: 120,
          clientY: 80
        }),
        expect.any(MouseEvent)
      );
    });

    it('Should return reactive value on watch', () => {
      const { result } = renderHook(() => {
        if (target)
          return useMouse(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseMouseReturn;
        return useMouse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.watch());

      act(() => {
        const event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: 60,
          clientY: 40
        });

        Object.defineProperty(event, 'pageX', { value: 60 });
        Object.defineProperty(event, 'pageY', { value: 40 });
        document.dispatchEvent(event);
      });

      expect(result.current.snapshot.x).toBe(60);
      expect(result.current.snapshot.y).toBe(40);
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useMouse(target) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseMouseReturn;
          return useMouse<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      const initialAddEventListenerCalls = addEventListenerSpy.mock.calls.length;
      const initialRemoveEventListenerCalls = removeEventListenerSpy.mock.calls.length;

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(initialAddEventListenerCalls + 2);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(initialRemoveEventListenerCalls + 2);
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useMouse(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseMouseReturn;
        return useMouse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });
});
