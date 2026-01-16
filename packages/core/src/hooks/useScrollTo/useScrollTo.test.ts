import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseScrollToReturn } from './useScrollTo';

import { useScrollTo } from './useScrollTo';

const mockScrollTo = vi.fn();

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

beforeEach(() => {
  vi.clearAllMocks();
  element.scrollTo = mockScrollTo;
  window.scrollTo = mockScrollTo;
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use scroll to', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollTo(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.trigger).toBeTypeOf('function');
    });

    it('Should use scroll to on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useScrollTo(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.trigger).toBeTypeOf('function');
    });

    it('Should scroll immediately by default', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollTo(target, { x: 100, y: 200 }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>({ x: 100, y: 200 });
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollTo).toHaveBeenCalledTimes(1);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 200,
        left: 100,
        behavior: 'auto'
      });
    });

    it('Should not to scroll when not immediately', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollTo(target, {
            x: 100,
            y: 200,
            immediately: false
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>({
          x: 100,
          y: 200,
          immediately: false
        });
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it('Should handle trigger method', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollTo(target, { x: 0, y: 0 }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>({ x: 0, y: 0 });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.trigger({ x: 50, y: 100 }));

      expect(mockScrollTo).toHaveBeenCalledTimes(2);
      expect(mockScrollTo).toHaveBeenCalledWith({
        left: 50,
        top: 100,
        behavior: undefined
      });
    });

    it('Should handle trigger method with behavior', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollTo(target, { x: 0, y: 0 }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>({ x: 0, y: 0 });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.trigger({ x: 50, y: 100, behavior: 'smooth' }));

      expect(mockScrollTo).toHaveBeenCalledTimes(2);
      expect(mockScrollTo).toHaveBeenCalledWith({
        left: 50,
        top: 100,
        behavior: 'smooth'
      });
    });

    it('Should handle behavior option', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollTo(target, {
            x: 100,
            y: 200,
            behavior: 'smooth'
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollToReturn;
        return useScrollTo<HTMLDivElement>({
          x: 100,
          y: 200,
          behavior: 'smooth'
        });
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 200,
        left: 100,
        behavior: 'smooth'
      });
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useScrollTo(target, { x: 100, y: 200 }) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseScrollToReturn;
          return useScrollTo<HTMLDivElement>({ x: 100, y: 200 });
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollTo).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById('target') });

      expect(mockScrollTo).toHaveBeenCalledTimes(2);
    });
  });
});
