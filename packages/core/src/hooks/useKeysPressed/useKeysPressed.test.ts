import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseKeysPressedReturn } from './useKeysPressed';

import { useKeysPressed } from './useKeysPressed';

type UseKeysPressedResult = UseKeysPressedReturn & {
  ref: StateRef<HTMLDivElement>;
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

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use keys pressed', () => {
      const { result } = renderHook(() => {
        if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
        return useKeysPressed<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.value).toStrictEqual([]);
    });

    it('Should use keys pressed on server side', () => {
      const { result } = renderHookServer(() => {
        if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
        return useKeysPressed<HTMLDivElement>();
      });

      if (target) expect(result.current.ref).toBeUndefined();
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      expect(result.current.value).toStrictEqual([]);
    });

    it('Should add pressed keys on key down', () => {
      const { result } = renderHook(() => {
        if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
        return useKeysPressed<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Escape',
            code: 'Escape'
          })
        );
      });

      expect(result.current.value).toStrictEqual([
        { key: 'Enter', code: 'Enter' },
        { key: 'Escape', code: 'Escape' }
      ]);
    });

    it('Should remove pressed key on key up', () => {
      const { result } = renderHook(() => {
        if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
        return useKeysPressed<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Escape',
            code: 'Escape'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keyup', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter'
          })
        );
      });

      expect(result.current.value).toStrictEqual([{ key: 'Escape', code: 'Escape' }]);
    });

    it('Should not duplicate pressed keys on repeated key down', () => {
      const { result } = renderHook(() => {
        if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
        return useKeysPressed<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter'
          })
        );
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter'
          })
        );
      });

      expect(result.current.value).toStrictEqual([{ key: 'Enter', code: 'Enter' }]);
    });

    it('Should handle enabled option', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');

      const { result } = renderHook(() => {
        if (target)
          return useKeysPressed(target, {
            enabled: false
          }) as unknown as UseKeysPressedResult;
        return useKeysPressed<HTMLDivElement>({
          enabled: false
        });
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            code: 'Enter'
          })
        );
      });

      expect(addEventListenerSpy).not.toHaveBeenCalled();
      expect(result.current.value).toStrictEqual([]);
    });

    it('Should handle target changes', () => {
      const addEventListenerSpy = vi.spyOn(element, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

      const { result, rerender } = renderHook(
        (target) => {
          if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
          return useKeysPressed<HTMLDivElement>();
        },
        {
          initialProps: target
        }
      );

      if (!target) act(() => result.current.ref(element));

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(addEventListenerSpy).toHaveBeenCalledTimes(4);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    });
  });

  it('Should cleanup on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(element, 'removeEventListener');

    const { result, unmount } = renderHook(() => {
      if (target) return useKeysPressed(target) as unknown as UseKeysPressedResult;
      return useKeysPressed<HTMLDivElement>();
    });

    if (!target) act(() => result.current.ref(element));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
  });
});
