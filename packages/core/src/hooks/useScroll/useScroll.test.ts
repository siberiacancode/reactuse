import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseScrollReturn } from './useScroll';

import { useScroll } from './useScroll';

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
  element.style.display = '';
  element.style.flexDirection = '';
  element.style.direction = '';

  Object.defineProperty(element, 'clientWidth', {
    value: 200,
    configurable: true
  });
  Object.defineProperty(element, 'clientHeight', {
    value: 200,
    configurable: true
  });
  Object.defineProperty(element, 'scrollWidth', {
    value: 800,
    configurable: true
  });
  Object.defineProperty(element, 'scrollHeight', {
    value: 1000,
    configurable: true
  });
  Object.defineProperty(element, 'scrollLeft', {
    value: 0,
    writable: true,
    configurable: true
  });
  Object.defineProperty(element, 'scrollTop', {
    value: 0,
    writable: true,
    configurable: true
  });
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use scroll', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.scrollTo).toBeTypeOf('function');
      expect(result.current.scrollIntoView).toBeTypeOf('function');
      expect(result.current.snapshot.x).toBe(0);
      expect(result.current.snapshot.y).toBe(0);
      expect(result.current.snapshot.directions).toEqual({
        left: false,
        right: false,
        top: false,
        bottom: false
      });
      expect(result.current.snapshot.arrived).toEqual({
        left: true,
        right: false,
        top: true,
        bottom: false
      });
      expect(result.current.watch).toBeTypeOf('function');
    });

    it('Should use scroll on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.snapshot.x).toBe(0);
      expect(result.current.snapshot.y).toBe(0);
      expect(result.current.watch).toBeTypeOf('function');
    });

    it('Should call callback on scroll', () => {
      const callback = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useScroll(target, callback) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>(callback);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.scrollLeft = 25;
        element.scrollTop = 75;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 25,
          y: 75
        }),
        expect.any(Event)
      );
    });

    it('Should call onStop callback on scrollend', () => {
      const onStop = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useScroll(target, { onStop }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>({ onStop });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('scrollend')));

      expect(onStop).toHaveBeenCalledTimes(1);
    });

    it('Should call onScroll callback on scroll', () => {
      const onScroll = vi.fn();

      const { result } = renderHook(() => {
        if (target)
          return useScroll(target, { onScroll }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>({ onScroll });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => element.dispatchEvent(new Event('scroll')));

      expect(onScroll).toHaveBeenCalledTimes(1);
    });

    it('Should accept options object signature', () => {
      const offset = { left: 10, right: 10, top: 10, bottom: 10 };
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target, { offset }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>({ offset });
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.watch());

      act(() => {
        element.scrollLeft = 10;
        element.scrollTop = 20;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.x).toBe(10);
      expect(result.current.snapshot.y).toBe(20);
      expect(result.current.snapshot.directions).toEqual({
        left: false,
        right: true,
        top: false,
        bottom: true
      });
      expect(result.current.snapshot.arrived).toEqual({
        left: true,
        right: false,
        top: false,
        bottom: false
      });
    });

    it('Should return reactive value on watch', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => (result.current.ref as StateRef<HTMLDivElement>)(element));

      act(() => result.current.watch());

      act(() => {
        element.scrollLeft = 10;
        element.scrollTop = 20;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.x).toBe(10);
      expect(result.current.snapshot.y).toBe(20);
    });

    it('Should update directions based on previous scroll position', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.watch());

      act(() => {
        element.scrollLeft = 120;
        element.scrollTop = 80;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.directions).toEqual({
        left: false,
        right: true,
        top: false,
        bottom: true
      });

      act(() => {
        element.scrollLeft = 40;
        element.scrollTop = 20;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.directions).toEqual({
        left: true,
        right: false,
        top: true,
        bottom: false
      });
    });

    it('Should update arrived states when reaching scroll boundaries', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.watch());

      act(() => {
        element.scrollLeft = 599;
        element.scrollTop = 799;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.arrived).toEqual({
        left: false,
        right: true,
        top: false,
        bottom: true
      });
    });

    it('Should invert arrived states for reverse flex directions', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.watch());

      act(() => {
        element.style.display = 'flex';
        element.style.flexDirection = 'row-reverse';
        element.scrollLeft = 0;
        element.scrollTop = 0;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.arrived.left).toBe(false);
      expect(result.current.snapshot.arrived.right).toBe(true);

      act(() => {
        element.style.flexDirection = 'column-reverse';
        element.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.snapshot.arrived.top).toBe(false);
      expect(result.current.snapshot.arrived.bottom).toBe(true);
    });

    it('Should cleanup on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scrollend', expect.any(Function));
    });
  });
});
