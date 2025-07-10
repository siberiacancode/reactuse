import { act, renderHook } from '@testing-library/react';

import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseHoverReturn } from './useHover';

import { useHover } from './useHover';

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
    it('Should use hover', () => {
      const { result } = renderHook(() => {
        if (target)
          return useHover(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current).toBe(false);
      if (!target) {
        expect(result.current.value).toBe(false);
        expect(result.current.ref).toBeTypeOf('function');
      }
    });

    it('Should change value on hover events', () => {
      const { result } = renderHook(() => {
        if (target)
          return useHover(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current).toBe(false);
      if (!target) expect(result.current.value).toBe(false);

      act(() => element.dispatchEvent(new Event('mouseenter')));

      if (target) expect(result.current).toBe(true);
      if (!target) expect(result.current.value).toBe(true);

      act(() => element.dispatchEvent(new Event('mouseleave')));

      if (target) expect(result.current).toBe(false);
      if (!target) expect(result.current.value).toBe(false);
    });

    it('Should call callback on hover', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useHover(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('mouseenter')));

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('Should call onEntry and onLeave callbacks', () => {
      const onEntry = vi.fn();
      const onLeave = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useHover(target, { onEntry, onLeave }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseHoverReturn;
        return useHover<HTMLDivElement>({ onEntry, onLeave });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('mouseenter')));

      expect(onEntry).toHaveBeenCalledTimes(1);
      expect(onLeave).not.toHaveBeenCalled();

      act(() => element.dispatchEvent(new Event('mouseleave')));

      expect(onEntry).toHaveBeenCalledTimes(1);
      expect(onLeave).toHaveBeenCalledTimes(1);
    });
  });
});
