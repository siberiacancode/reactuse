import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseScrollReturn } from './useScroll';

import { useScroll } from './useScroll';

const mockScrollTo = vi.fn();
const mockScrollIntoView = vi.fn();
const mockOnScroll = vi.fn();

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
  element.scrollTo = mockScrollTo;
  element.scrollIntoView = mockScrollIntoView;

  Object.defineProperty(element, 'scrollTop', { value: 0, writable: true });
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

      expect(result.current.scrollTo).toBeTypeOf('function');
      expect(result.current.scrollIntoView).toBeTypeOf('function');
      expect(result.current.scrolling).toBeTypeOf('boolean');

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should use scroll to on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      expect(result.current.scrollTo).toBeTypeOf('function');
      expect(result.current.scrollIntoView).toBeTypeOf('function');
      expect(result.current.scrolling).toBeTypeOf('boolean');

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should change scrolling state', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.dispatchEvent(new Event('scroll'));
      });
      expect(result.current.scrolling).toBe(true);

      act(() => {
        element.dispatchEvent(new Event('scrollend'));
      });
      expect(result.current.scrolling).toBe(false);
    });

    it('Should updates scroll directions on scroll', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target, mockOnScroll) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>(mockOnScroll);
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.scrollTop = 100;
        element.dispatchEvent(new Event('scroll'));
      });

      act(() => {
        element.scrollTop = 200;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(mockOnScroll).toHaveBeenCalled();

      const params = mockOnScroll.mock.calls.at(-1)?.[0];

      expect(params.directions.bottom).toBe(true);
      expect(params.directions.top).toBe(false);
    });

    it('Should update arrived on scroll', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScroll(target, mockOnScroll) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollReturn;
        return useScroll<HTMLDivElement>(mockOnScroll);
      });

      if (!target) act(() => result.current.ref(element));

      Object.defineProperty(element, 'clientHeight', { value: 500 });
      Object.defineProperty(element, 'scrollHeight', { value: 1000 });

      const scrollTop = 0;
      act(() => {
        Object.defineProperty(element, 'scrollTop', { value: scrollTop });
      });

      act(() => {
        element.scrollTop = 500;
        element.dispatchEvent(new Event('scroll'));
      });

      expect(mockOnScroll).toHaveBeenCalled();

      const params = mockOnScroll.mock.calls[0][0];

      expect(params.arrived.bottom).toBe(true);
      expect(params.arrived.top).toBe(false);
    });
  });
});
