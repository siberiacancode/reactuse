import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { DEFAULT_THRESHOLD_TIME, useDoubleClick } from './useDoubleClick';

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') }
];
const element = document.getElementById('target') as HTMLDivElement;

targets.forEach((target) => {
  describe(`${target}`, () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.clearAllMocks();
    });

    it('Should use double click', () => {
      const { result } = renderHook(() => {
        if (target) return useDoubleClick(target, vi.fn()) as unknown as StateRef<HTMLDivElement>;
        return useDoubleClick(vi.fn());
      });

      if (!target) expect(result.current).toBeTypeOf('function');
    });

    it('Should handle double click with mouse', () => {
      const callback = vi.fn();
      document.body.appendChild(element);

      const { result } = renderHook(() => {
        if (target) return useDoubleClick(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useDoubleClick(callback);
      });

      if (!target) act(() => result.current(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      expect(callback).not.toBeCalled();

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      expect(callback).toBeCalledTimes(1);
    });

    it('Should handle double click with touch', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target) return useDoubleClick(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useDoubleClick(callback);
      });

      if (!target) act(() => result.current(element));

      act(() => element.dispatchEvent(new TouchEvent('touchstart')));

      expect(callback).not.toBeCalled();

      act(() => element.dispatchEvent(new TouchEvent('touchstart')));

      expect(callback).toBeCalledTimes(1);
    });

    it('Should handle single click', () => {
      const callback = vi.fn();
      const onSingleClick = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDoubleClick(target, callback, {
            onSingleClick
          }) as unknown as StateRef<HTMLDivElement>;
        return useDoubleClick(callback, { onSingleClick });
      });

      if (!target) act(() => result.current(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      expect(onSingleClick).not.toBeCalled();

      act(() => vi.advanceTimersByTime(DEFAULT_THRESHOLD_TIME));

      expect(onSingleClick).toBeCalledTimes(1);
    });

    it('Should respect custom threshold', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useDoubleClick(target, callback, {
            threshold: 500
          }) as unknown as StateRef<HTMLDivElement>;
        return useDoubleClick(callback, { threshold: 500 });
      });

      if (!target) act(() => result.current(element));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      act(() => vi.advanceTimersByTime(400));

      act(() => element.dispatchEvent(new MouseEvent('mousedown')));

      expect(callback).toBeCalledTimes(1);
    });

    it('Should cleanup on unmount', () => {
      const callback = vi.fn();
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target) return useDoubleClick(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useDoubleClick(callback);
      });

      if (!target) act(() => result.current(element));

      unmount();

      expect(removeEventListenerSpy).toBeCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toBeCalledWith('touchstart', expect.any(Function));
    });
  });
});
