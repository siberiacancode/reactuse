import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';
import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseCssVarReturn } from './useCssVar';

import { useCssVar } from './useCssVar';

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
  element.style.removeProperty('--test-color');
  element.className = '';
  vi.clearAllMocks();
});

const trigger = createTrigger<Node, MutationCallback>();
const mockMutationObserverObserve = vi.fn();
const mockMutationObserverDisconnect = vi.fn();
class MockMutationObserver {
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  callback: MutationCallback;

  observe = (target: Node) => {
    trigger.add(target, this.callback);
    mockMutationObserverObserve();
  };
  disconnect = () => mockMutationObserverDisconnect();
}

globalThis.MutationObserver = MockMutationObserver as any;

it('Should use css var with default target', () => {
  renderHook(() => useCssVar('--test-color', 'green'));

  expect(window.document.documentElement.style.getPropertyValue('--test-color')).toBe('green');
});

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use css var', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'green') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'green');
      });

      expect(result.current.value).toBeTypeOf('string');
      expect(result.current.set).toBeTypeOf('function');

      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should use css var on server side  ', () => {
      const { result } = renderHookServer(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'green') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'green');
      });

      expect(result.current.value).toBe('green');
      if (!target) expect(result.current.ref).toBeTypeOf('function');
      if (target) expect(result.current.ref).toBeUndefined();
    });

    it('Should work without initial value', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color') as any;
        }
        return useCssVar('--test-color');
      });

      expect(result.current.value).toBe('');
      expect(result.current.set).toBeTypeOf('function');
    });

    it('Should set initial value', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'green') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'green');
      });

      // 🧊 important:
      // Due to the default value and conditional rendering in RTL,
      // the hook first renders with the default window target, and then when ref is added
      if (!target) return;

      expect(element.style.getPropertyValue('--test-color')).toBe('green');
      expect(result.current.value).toBe('green');
    });

    it('Should update value', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'green') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'green');
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.set('purple'));

      expect(result.current.value).toBe('purple');

      expect(element.style.getPropertyValue('--test-color')).toBe('purple');
    });

    it('Should remove value', () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'orange') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'orange');
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.remove());

      expect(result.current.value).toBe('');
      expect(element.style.getPropertyValue('--test-color')).toBe('');
    });

    it('Should observe style changes', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color');
      });

      if (!target) act(() => result.current.ref(element));

      act(() => {
        element.style.setProperty('--test-color', 'pink');
        trigger.callback(element);
      });

      await waitFor(() => expect(result.current.value).toBe('pink'));
    });

    it('Should observe class changes', async () => {
      const { result } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'green') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'green');
      });

      expect(result.current.value).toBe('green');

      act(() => result.current.remove());

      if (!target) act(() => result.current.ref(element));

      const style = document.createElement('style');
      style.textContent = '.test-class { --test-color: pink; }';
      document.head.appendChild(style);

      act(() => {
        element.className = 'test-class';
        trigger.callback(element);
      });

      await waitFor(() => expect(result.current.value).toBe('pink'));
    });

    it('Should handle target changes', () => {
      const { rerender } = renderHook(
        (target) => {
          if (target) {
            return useCssVar(target, '--test-color') as unknown as {
              ref: StateRef<HTMLDivElement>;
            } & UseCssVarReturn;
          }
          return useCssVar('--test-color');
        },
        {
          initialProps: target
        }
      );

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(1);
      expect(mockMutationObserverDisconnect).not.toHaveBeenCalled();

      rerender({ current: document.getElementById('target') });

      expect(mockMutationObserverObserve).toHaveBeenCalledTimes(2);
      expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(1);
    });

    it('Should disconnect on unmount', () => {
      const { result, unmount } = renderHook(() => {
        if (target) {
          return useCssVar(target, '--test-color', 'green') as unknown as {
            ref: StateRef<HTMLDivElement>;
          } & UseCssVarReturn;
        }
        return useCssVar('--test-color', 'green');
      });

      if (!target) act(() => result.current.ref(element));

      unmount();

      if (!target)
        // 🧊 important:
        // Due to the default value and conditional rendering in RTL,
        // the hook first renders with the default window target, and then when ref is added,
        // another unmount occurs, resulting in 2 disconnects
        expect(mockMutationObserverDisconnect).toHaveBeenCalledTimes(2);
      else expect(mockMutationObserverDisconnect).toHaveBeenCalledOnce();
    });
  });
});
