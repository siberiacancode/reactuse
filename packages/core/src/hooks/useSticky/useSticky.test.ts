import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseStickyReturn } from './useSticky';

import { useSticky } from './useSticky';

const stickyElement = document.createElement('div');
stickyElement.id = 'sticky-target';
document.body.appendChild(stickyElement);

const rootElement = document.createElement('div');
rootElement.id = 'sticky-root';
document.body.appendChild(rootElement);

const element = document.getElementById('sticky-target') as HTMLDivElement;
const root = document.getElementById('sticky-root') as HTMLDivElement;

const targets = [
  undefined,
  target('#sticky-target'),
  target(document.getElementById('sticky-target')!),
  target(() => document.getElementById('sticky-target')!),
  { current: document.getElementById('sticky-target') },
  Object.assign(() => {}, {
    state: document.getElementById('sticky-target'),
    current: document.getElementById('sticky-target')
  })
];

const createRect = ({
  top,
  right,
  bottom,
  left,
  width,
  height
}: {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}) =>
  ({
    top,
    right,
    bottom,
    left,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({})
  }) as DOMRect;

let elementRect = createRect({
  top: 30,
  right: 150,
  bottom: 90,
  left: 50,
  width: 100,
  height: 60
});

let rootRect = createRect({
  top: 100,
  right: 360,
  bottom: 400,
  left: 60,
  width: 300,
  height: 300
});

beforeEach(() => {
  vi.restoreAllMocks();

  element.style.top = '10px';
  element.style.right = 'auto';
  element.style.bottom = 'auto';
  element.style.left = 'auto';

  root.style.paddingTop = '0px';
  root.style.paddingRight = '0px';
  root.style.paddingBottom = '0px';
  root.style.paddingLeft = '0px';
  root.style.borderTopWidth = '0px';
  root.style.borderRightWidth = '0px';
  root.style.borderBottomWidth = '0px';
  root.style.borderLeftWidth = '0px';

  elementRect = createRect({
    top: 30,
    right: 150,
    bottom: 90,
    left: 50,
    width: 100,
    height: 60
  });

  rootRect = createRect({
    top: 100,
    right: 360,
    bottom: 400,
    left: 60,
    width: 300,
    height: 300
  });

  Object.defineProperty(window, 'innerHeight', {
    value: 120,
    configurable: true
  });
  Object.defineProperty(window, 'innerWidth', {
    value: 180,
    configurable: true
  });
  Object.defineProperty(root, 'offsetHeight', {
    value: 160,
    configurable: true
  });
  Object.defineProperty(root, 'offsetWidth', {
    value: 220,
    configurable: true
  });

  element.getBoundingClientRect = vi.fn(() => elementRect);
  root.getBoundingClientRect = vi.fn(() => rootRect);
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use sticky', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSticky(target) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.stuck).toBeFalsy();
    });

    it('Should use sticky on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useSticky(target) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.stuck).toBeFalsy();
    });

    it('Should update stuck state for top sticky offset', () => {
      const { result } = renderHook(() => {
        if (target)
          return useSticky(target) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.stuck).toBeFalsy();

      act(() => {
        elementRect = createRect({
          top: 10,
          right: 150,
          bottom: 70,
          left: 50,
          width: 100,
          height: 60
        });
        document.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.stuck).toBeTruthy();
    });

    it('Should update stuck state for bottom sticky offset', () => {
      element.style.top = 'auto';
      element.style.bottom = '15px';

      const { result } = renderHook(() => {
        if (target)
          return useSticky(target) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.stuck).toBeFalsy();

      act(() => {
        elementRect = createRect({
          top: 40,
          right: 150,
          bottom: 105,
          left: 50,
          width: 100,
          height: 65
        });
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.stuck).toBeTruthy();
    });

    it('Should update stuck state for horizontal sticky axis', () => {
      element.style.top = 'auto';
      element.style.left = '12px';

      const { result } = renderHook(() => {
        if (target)
          return useSticky(target, {
            axis: 'horizontal'
          }) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>({
          axis: 'horizontal'
        });
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.stuck).toBeFalsy();

      act(() => {
        elementRect = createRect({
          top: 30,
          right: 112,
          bottom: 90,
          left: 12,
          width: 100,
          height: 60
        });
        window.dispatchEvent(new Event('orientationchange'));
      });

      expect(result.current.stuck).toBeTruthy();
    });

    it('Should handle root target in options', () => {
      element.style.top = '10px';
      root.style.paddingTop = '8px';
      root.style.paddingLeft = '6px';
      root.style.borderTopWidth = '2px';
      root.style.borderLeftWidth = '4px';

      const { result } = renderHook(() => {
        if (target)
          return useSticky(target, {
            root: { current: root }
          }) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>({
          root: { current: root }
        });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => root.dispatchEvent(new Event('scroll')));

      expect(result.current.stuck).toBeTruthy();
    });

    it('Should handle target changes', () => {
      const addScrollListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeScrollListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target)
            return useSticky(target) as unknown as UseStickyReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useSticky<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addScrollListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true
      });
      expect(removeScrollListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('sticky-target') });

      expect(addScrollListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeScrollListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('Should cleanup on unmount', () => {
      const removeScrollListenerSpy = vi.spyOn(document, 'removeEventListener');
      const removeWindowListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { result, unmount } = renderHook(() => {
        if (target)
          return useSticky(target) as unknown as UseStickyReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useSticky<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      expect(removeScrollListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(removeWindowListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeWindowListenerSpy).toHaveBeenCalledWith(
        'orientationchange',
        expect.any(Function)
      );
    });
  });
});
