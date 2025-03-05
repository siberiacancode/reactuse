import { act, renderHook } from '@testing-library/react';

import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useClickOutside } from './useClickOutside';

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') }
];

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use click outside', () => {
      const { result } = renderHook(() => {
        if (target) return useClickOutside(target, vi.fn()) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(vi.fn());
      });

      if (!target) expect(result.current).toBeTypeOf('function');
    });

    it('Should call callback when clicked outside', () => {
      const callback = vi.fn();
      const element = document.createElement('div');
      document.body.appendChild(element);

      const { result } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      expect(callback).not.toBeCalled();

      act(() => document.dispatchEvent(new Event('click')));

      expect(callback).toBeCalledTimes(1);
    });

    it('Should not call callback when clicked inside', () => {
      const callback = vi.fn();
      const element = document.createElement('div');
      document.body.appendChild(element);

      const { result } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      act(() => element.dispatchEvent(new Event('click')));

      expect(callback).not.toBeCalled();
    });

    it('Should disconnect on unmount', () => {
      const mockRemoveEventListener = vi.spyOn(document, 'removeEventListener');
      const callback = vi.fn();
      const element = document.createElement('div');
      document.body.appendChild(element);

      const { result, unmount } = renderHook(() => {
        if (target) return useClickOutside(target, callback) as unknown as StateRef<HTMLDivElement>;
        return useClickOutside(callback);
      });

      if (!target) act(() => result.current(element));

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
    });
  });
});
