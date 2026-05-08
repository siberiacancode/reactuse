import { act, renderHook } from '@testing-library/react';
import { useSticky, UseStickyReturn } from './useSticky';
import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';
import { StateRef } from '../state';

const DEFAULT_MOCK_BOUNDING_DATA = {
  top: 0,
  left: 0,
  bottom: 200,
  right: 0,
  width: 100,
  height: 100,
  x: 0,
  y: 100,
  toJSON: () => {}
};

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') }
];

const root = target(document.getElementById('target-root')!);
const element = document.getElementById('target') as HTMLDivElement;

const getBoundingClientRectSpy = vi.spyOn(element, 'getBoundingClientRect');

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use sticky', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSticky(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            stuck: UseStickyReturn;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) {
        expect(result.current.ref).toBeTypeOf('function');
        expect(result.current.stuck).toBeTypeOf('boolean');
      } else {
        expect(result.current).toBeTypeOf('boolean');
      }
    });

    it('Should use sticky on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useSticky(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            stuck: UseStickyReturn;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) {
        expect(result.current.ref).toBeTypeOf('function');
        expect(result.current.stuck).toBeTypeOf('boolean');
      } else {
        expect(result.current).toBeTypeOf('boolean');
      }
    });

    it('Should update stuck element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSticky(target, { root }) as unknown as {
            ref: StateRef<HTMLDivElement>;
            stuck: UseStickyReturn;
          };
        return useSticky<HTMLDivElement>();
      });

      act(() => {
        getBoundingClientRectSpy.mockReturnValue({
          ...DEFAULT_MOCK_BOUNDING_DATA,
          top: 200
        });
        window.dispatchEvent(new Event('resize'));
      });

      if (target) {
        expect(result.current).toBe(false);
      }

      act(() => {
        getBoundingClientRectSpy.mockReturnValue({
          ...DEFAULT_MOCK_BOUNDING_DATA,
          top: 0
        });
        window.dispatchEvent(new Event('resize'));
      });

      if (target) {
        expect(result.current).toBe(true);
      }
    });

    it('Should update stuck element with horizontal axis', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSticky(target, {
            root,
            axis: 'horizontal'
          }) as unknown as {
            ref: StateRef<HTMLDivElement>;
            stuck: UseStickyReturn;
          };
        return useSticky<HTMLDivElement>();
      });

      act(() => {
        getBoundingClientRectSpy.mockReturnValue({
          ...DEFAULT_MOCK_BOUNDING_DATA,
          left: 200
        });
        window.dispatchEvent(new Event('resize'));
      });

      if (target) {
        expect(result.current).toBe(false);
      }

      act(() => {
        getBoundingClientRectSpy.mockReturnValue({
          ...DEFAULT_MOCK_BOUNDING_DATA,
          left: 0
        });
        window.dispatchEvent(new Event('resize'));
      });

      if (target) {
        expect(result.current).toBe(true);
      }
    });

    it('Should clean up on unmount', () => {
      const removeEventListenerWindowSpy = vi.spyOn(window, 'removeEventListener');

      const removeEventListenerSpy = vi.spyOn(document.documentElement, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useSticky(target) as unknown as {
            ref: StateRef<HTMLDivElement>;
            stuck: UseStickyReturn;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeEventListenerWindowSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventListenerWindowSpy).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function)
      );
    });
  });
});
