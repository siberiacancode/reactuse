import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseCollapseReturn } from './useCollapse';

import { useCollapse } from './useCollapse';

const INITIAL_STYLES = {
  display: 'block',
  height: '32px',
  overflow: 'visible',
  transition: 'opacity 100ms linear',
  willChange: 'opacity'
};

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

let mockAnimationFrameCallback: FrameRequestCallback;

beforeEach(() => {
  element.replaceChildren();
  Object.assign(element.style, INITIAL_STYLES);
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ height: 48 } as DOMRect);
  Object.defineProperty(element, 'scrollHeight', {
    value: 120,
    configurable: true
  });

  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    mockAnimationFrameCallback = callback;
    return 1;
  });
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use collapse', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.expanded).toBeFalsy();
      expect(result.current.open).toBeTypeOf('function');
      expect(result.current.close).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
      expect(element.style.display).toBe('none');
      expect(element.style.height).toBe('0px');
      expect(element.style.overflow).toBe('hidden');
    });

    it('Should use collapse on server side', () => {
      const { result } = renderHookServer(() => {
        if (target)
          return useCollapse(target) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.expanded).toBeFalsy();
      expect(result.current.open).toBeTypeOf('function');
      expect(result.current.close).toBeTypeOf('function');
      expect(result.current.toggle).toBeTypeOf('function');
    });

    it('Should use initial expanded state', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, true) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.expanded).toBeTruthy();
      expect(element.style).toEqual(expect.objectContaining(INITIAL_STYLES));
    });

    it('Should open collapse', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);

      expect(result.current.expanded).toBeTruthy();
    });

    it('Should close collapse', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, true) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.close);

      expect(result.current.expanded).toBeFalsy();
    });

    it('Should toggle collapse', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.toggle());
      expect(result.current.expanded).toBeTruthy();

      act(() => result.current.toggle());
      expect(result.current.expanded).toBeFalsy();

      act(() => result.current.toggle(true));
      expect(result.current.expanded).toBeTruthy();

      act(() => result.current.toggle(false));
      expect(result.current.expanded).toBeFalsy();
    });

    it('Should ignore same value', () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, false, { onEnd, onStart }) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(false, { onEnd, onStart });
      });

      if (!target) act(() => result.current.ref(element));
      act(() => result.current.toggle(false));

      expect(result.current.expanded).toBeFalsy();
      expect(onStart).not.toHaveBeenCalled();
      expect(onEnd).not.toHaveBeenCalled();
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('Should animate opening', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);

      expect(element.style.display).toBe(INITIAL_STYLES.display);
      expect(element.style.height).toBe('48px');
      expect(element.style.overflow).toBe('hidden');
      expect(element.style.transition).toBe('height 200ms ease');
      expect(element.style.willChange).toBe('height');

      act(() => mockAnimationFrameCallback(performance.now()));

      expect(element.style.height).toBe('120px');

      act(() =>
        element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'height' }))
      );

      expect(element.style).toEqual(expect.objectContaining(INITIAL_STYLES));
    });

    it('Should animate closing', () => {
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, true) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(true);
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.close);

      expect(element.style.height).toBe('48px');
      expect(element.style.transition).toBe('height 200ms ease');

      act(() => mockAnimationFrameCallback(performance.now()));

      expect(element.style.height).toBe('0px');

      act(() =>
        element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'height' }))
      );

      expect(element.style.display).toBe('none');
      expect(element.style.height).toBe('0px');
      expect(element.style.overflow).toBe('hidden');
      expect(element.style.transition).toBe(INITIAL_STYLES.transition);
      expect(element.style.willChange).toBe(INITIAL_STYLES.willChange);
    });

    it('Should update immediately', () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, false, {
            duration: 0,
            onEnd,
            onStart
          }) as UseCollapseReturn & { ref: StateRef<HTMLDivElement> };
        return useCollapse<HTMLDivElement>(false, { duration: 0, onEnd, onStart });
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);

      expect(element.style).toEqual(expect.objectContaining(INITIAL_STYLES));

      act(result.current.close);

      expect(element.style.display).toBe('none');
      expect(element.style.height).toBe('0px');
      expect(element.style.overflow).toBe('hidden');
      expect(onStart).toHaveBeenCalledTimes(2);
      expect(onEnd).toHaveBeenCalledTimes(2);
      expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('Should call transition callbacks', () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, false, { onEnd, onStart }) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(false, { onEnd, onStart });
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);

      expect(onStart).toHaveBeenCalledOnce();
      expect(onEnd).not.toHaveBeenCalled();

      act(() =>
        element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'height' }))
      );

      expect(onEnd).toHaveBeenCalledOnce();
    });

    it('Should use latest options', () => {
      const { rerender, result } = renderHook(
        (options) => {
          if (target)
            return useCollapse(target, false, options) as UseCollapseReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useCollapse<HTMLDivElement>(false, options);
        },
        {
          initialProps: { duration: 200, easing: 'ease' }
        }
      );

      if (!target) act(() => result.current.ref(element));
      rerender({ duration: 450, easing: 'linear' });
      act(result.current.open);

      expect(element.style.transition).toBe('height 450ms linear');
    });

    it('Should use latest callbacks', () => {
      const initialOnStart = vi.fn();
      const initialOnEnd = vi.fn();
      const onStart = vi.fn();
      const onEnd = vi.fn();
      const { rerender, result } = renderHook(
        (callbacks) => {
          if (target)
            return useCollapse(target, false, callbacks) as UseCollapseReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useCollapse<HTMLDivElement>(false, callbacks);
        },
        { initialProps: { onEnd: initialOnEnd, onStart: initialOnStart } }
      );

      if (!target) act(() => result.current.ref(element));
      rerender({ onEnd, onStart });
      act(result.current.open);

      act(() =>
        element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'height' }))
      );

      expect(initialOnStart).not.toHaveBeenCalled();
      expect(initialOnEnd).not.toHaveBeenCalled();
      expect(onStart).toHaveBeenCalledOnce();
      expect(onEnd).toHaveBeenCalledOnce();
    });

    it('Should ignore unrelated transition events', () => {
      const onEnd = vi.fn();
      const child = document.createElement('span');
      element.append(child);
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target, false, { onEnd }) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(false, { onEnd });
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);
      act(() => mockAnimationFrameCallback(performance.now()));

      act(() =>
        child.dispatchEvent(
          Object.assign(new Event('transitionend', { bubbles: true }), {
            propertyName: 'height'
          })
        )
      );
      act(() =>
        element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'width' }))
      );

      expect(onEnd).not.toHaveBeenCalled();
      expect(element.style.height).toBe('120px');
      expect(element.style.transition).toBe('height 200ms ease');
      expect(element.style.willChange).toBe('height');
    });

    it('Should replace pending animation', () => {
      const mockCancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
      const { result } = renderHook(() => {
        if (target)
          return useCollapse(target) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);
      act(result.current.close);

      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1);

      act(() => mockAnimationFrameCallback(performance.now()));

      expect(element.style.height).toBe('0px');
    });

    it('Should handle target changes', () => {
      const nextElement = document.createElement('div');
      Object.assign(nextElement.style, INITIAL_STYLES);

      const { result, rerender } = renderHook(
        (nextTarget) => {
          if (nextTarget)
            return useCollapse(nextTarget) as UseCollapseReturn & {
              ref: StateRef<HTMLDivElement>;
            };
          return useCollapse<HTMLDivElement>();
        },
        { initialProps: target }
      );

      if (!target) act(() => result.current.ref(element));

      expect(element.style.display).toBe('none');

      rerender({ current: nextElement });

      expect(element.style).toEqual(expect.objectContaining(INITIAL_STYLES));
      expect(nextElement.style.display).toBe('none');
      expect(nextElement.style.height).toBe('0px');
      expect(nextElement.style.overflow).toBe('hidden');
    });

    it('Should not subscribe when element is not resolved', () => {
      if (target) return;

      const { result } = renderHook(useCollapse);

      expect(result.current.expanded).toBeFalsy();

      act(result.current.open);

      expect(result.current.expanded).toBeTruthy();
    });

    it('Should cleanup on unmount', () => {
      const onEnd = vi.fn();
      const mockCancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
      const { result, unmount } = renderHook(() => {
        if (target)
          return useCollapse(target, false, { onEnd }) as UseCollapseReturn & {
            ref: StateRef<HTMLDivElement>;
          };
        return useCollapse<HTMLDivElement>(false, { onEnd });
      });

      if (!target) act(() => result.current.ref(element));
      act(result.current.open);

      unmount();
      act(() =>
        element.dispatchEvent(Object.assign(new Event('transitionend'), { propertyName: 'height' }))
      );

      expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1);
      expect(element.style).toEqual(expect.objectContaining(INITIAL_STYLES));
      expect(onEnd).not.toHaveBeenCalled();
    });
  });
});
