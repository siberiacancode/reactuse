import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseLockScrollReturn } from './useLockScroll';

import { useLockScroll } from './useLockScroll';

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    overflow: 'visible'
  }),
  writable: true,
  configurable: true
});

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
    it('Should use lock scroll', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>();
      });

      expect(result.current.value).toBeTruthy();
      expect(result.current.lock).toBeTypeOf('function');
      expect(result.current.unlock).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
    });

    it('Should use lock scroll on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useLockScroll(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>();
      });

      expect(result.current.value).toBeTruthy();
      expect(result.current.lock).toBeTypeOf('function');
      expect(result.current.unlock).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
    });

    it('Should lock scroll by default when enabled', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeTruthy();
      expect(element.style.overflow).toBe('hidden');
    });

    it('Should correctly handle enabled option', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target, { enabled: false }) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>({ enabled: false });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeFalsy();
      expect(element.style.overflow).toBe('visible');
    });

    it('Should correctly handle unlock scroll manually', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeTruthy();
      expect(element.style.overflow).toBe('hidden');

      act(() => result.current.unlock());

      expect(result.current.value).toBeFalsy();
      expect(element.style.overflow).toBe('visible');
    });

    it('Should unlock scroll manually', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeTruthy();

      act(() => result.current.unlock());

      expect(result.current.value).toBeFalsy();
      expect(element.style.overflow).toBe('visible');
    });

    it('Should toggle scroll state', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target, { enabled: false }) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>({ enabled: false });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeFalsy();

      act(() => result.current.toggle());

      expect(result.current.value).toBeTruthy();
      expect(element.style.overflow).toBe('hidden');

      act(() => result.current.toggle());

      expect(result.current.value).toBeFalsy();
      expect(element.style.overflow).toBe('visible');
    });

    it('Should toggle scroll state with value', () => {
      const { result } = renderHook(() => {
        if (target)
          return useLockScroll(target, { enabled: false }) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>({ enabled: false });
      });
      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeFalsy();

      act(() => result.current.toggle(true));

      expect(result.current.value).toBeTruthy();
      expect(element.style.overflow).toBe('hidden');

      act(() => result.current.toggle(false));

      expect(result.current.value).toBeFalsy();
      expect(element.style.overflow).toBe('visible');
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useLockScroll(target) as {
              ref: StateRef<HTMLDivElement>;
            } & UseLockScrollReturn<Element>;
          return useLockScroll<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBeTruthy();

      rerender({ current: document.getElementById('target') });

      expect(result.current.value).toBeTruthy();
    });

    it('Should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target)
          return useLockScroll(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseLockScrollReturn<Element>;
        return useLockScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(element.style.overflow).toBe('visible');
    });
  });
});
