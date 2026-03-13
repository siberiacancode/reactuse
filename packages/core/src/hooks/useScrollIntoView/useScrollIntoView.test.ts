import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseScrollIntoViewReturn } from './useScrollIntoView';

import { useScrollIntoView } from './useScrollIntoView';

const mockScrollIntoView = vi.fn();

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
  element.scrollIntoView = mockScrollIntoView;
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use scroll into view', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollIntoView(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.trigger).toBeTypeOf('function');
    });

    it('Should use scroll into view on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useScrollIntoView(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>();
      });

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();

      expect(result.current.trigger).toBeTypeOf('function');
    });

    it('Should scroll into view immediately by default', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollIntoView(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    });

    it('Should not scroll into view when not immediately', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollIntoView(target, {
            immediately: false
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>({ immediately: false });
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('Should handle trigger method', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollIntoView(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.trigger({ behavior: 'auto', block: 'center' }));

      expect(mockScrollIntoView).toHaveBeenCalledTimes(2);
      expect(mockScrollIntoView).toHaveBeenLastCalledWith({
        behavior: 'auto',
        block: 'center',
        inline: undefined
      });
    });

    it('Should handle trigger method with all options', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollIntoView(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() =>
        result.current.trigger({
          behavior: 'smooth',
          block: 'end',
          inline: 'center'
        })
      );

      expect(mockScrollIntoView).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        block: 'end',
        inline: 'center'
      });
    });

    it('Should handle custom options', () => {
      const { result } = renderHook(() => {
        if (target)
          return useScrollIntoView(target, {
            behavior: 'auto',
            block: 'center',
            inline: 'start'
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseScrollIntoViewReturn;
        return useScrollIntoView<HTMLDivElement>({
          behavior: 'auto',
          block: 'center',
          inline: 'start'
        });
      });

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'center',
        inline: 'start'
      });
    });

    it('Should handle target changes', () => {
      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useScrollIntoView(target) as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseScrollIntoViewReturn;
          return useScrollIntoView<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);

      rerender({ current: document.getElementById('target') });

      expect(mockScrollIntoView).toHaveBeenCalledTimes(2);
    });
  });
});
