import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useLongPress } from './useLongPress';

const DEFAULT_THRESHOLD_TIME = 400;

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
  vi.clearAllMocks();
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use long press', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useLongPress(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback);
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      if (!target) expect(result.current.pressed).toBeFalsy();
      if (target) expect(result.current).toBeFalsy();
    });

    it('Should use long press on server side', () => {
      const callback = vi.fn();
      const { result } = renderHookServer(() => {
        if (target)
          return useLongPress(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback);
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      if (!target) expect(result.current.pressed).toBeFalsy();
      if (target) expect(result.current).toBeFalsy();
    });

    it('Should call onStart on press start', () => {
      const callback = vi.fn();
      const onStart = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useLongPress(target, callback, { onStart }) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback, { onStart });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      expect(onStart).toHaveBeenCalledTimes(1);
      expect(callback).not.toHaveBeenCalled();

      act(() => element.dispatchEvent(new TouchEvent('touchstart')));

      expect(onStart).toHaveBeenCalledTimes(2);
      expect(callback).not.toHaveBeenCalled();
    });

    it('Should call callback after threshold time', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useLongPress(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      expect(callback).not.toHaveBeenCalled();

      act(() => vi.advanceTimersByTime(DEFAULT_THRESHOLD_TIME));

      expect(callback).toHaveBeenCalledTimes(1);

      if (!target) expect(result.current.pressed).toBeTruthy();
      if (target) expect(result.current).toBeTruthy();
    });

    it('Should respect custom threshold', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useLongPress(target, callback, {
            threshold: 1000
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback, {
          threshold: 1000
        });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));
      act(() => vi.advanceTimersByTime(1000));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should call onCancel when released before threshold', () => {
      const callback = vi.fn();
      const onCancel = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useLongPress(target, callback, { onCancel }) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback, { onCancel });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      act(() => vi.advanceTimersByTime(100));

      act(() => window.dispatchEvent(new MouseEvent('mouseup')));

      expect(callback).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledTimes(1);

      act(() => element.dispatchEvent(new TouchEvent('touchstart')));

      act(() => vi.advanceTimersByTime(100));

      act(() => window.dispatchEvent(new TouchEvent('touchend')));

      expect(callback).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledTimes(2);

      if (!target) expect(result.current.pressed).toBeFalsy();
      if (target) expect(result.current).toBeFalsy();
    });

    it('Should call onFinish when released after threshold', () => {
      const callback = vi.fn();
      const onFinish = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useLongPress(target, callback, { onFinish }) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback, { onFinish });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      act(() => vi.advanceTimersByTime(DEFAULT_THRESHOLD_TIME));

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => window.dispatchEvent(new MouseEvent('mouseup')));

      expect(onFinish).toHaveBeenCalledTimes(1);

      act(() => element.dispatchEvent(new TouchEvent('touchstart')));

      act(() => vi.advanceTimersByTime(DEFAULT_THRESHOLD_TIME));

      expect(callback).toHaveBeenCalledTimes(2);

      act(() => window.dispatchEvent(new TouchEvent('touchend')));

      expect(onFinish).toHaveBeenCalledTimes(2);
    });

    it('Should handle target changes', () => {
      const callback = vi.fn();
      const elementAddEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const elementRemoveEventListenerSpy = vi.spyOn(element, 'removeEventListener');
      const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useLongPress(target, callback) as unknown as {
              ref: StateRef<HTMLDivElement>;
              pressed: boolean;
            };
          return useLongPress<HTMLDivElement>(callback);
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(elementAddEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(elementRemoveEventListenerSpy).not.toHaveBeenCalled();
      expect(windowRemoveEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(elementAddEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(windowAddEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(elementRemoveEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it('Should cleanup on unmount', () => {
      const callback = vi.fn();
      const elementRemoveEventListenerSpy = vi.spyOn(element, 'removeEventListener');
      const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useLongPress(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
            pressed: boolean;
          };
        return useLongPress<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(elementRemoveEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(elementRemoveEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function)
      );

      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
    });
  });
});
