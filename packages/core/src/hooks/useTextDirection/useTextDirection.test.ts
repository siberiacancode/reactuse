import { act, renderHook } from '@testing-library/react';

import { target } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';
import type { UseTextDirectionReturn } from './useTextDirection';

import { useTextDirection } from './useTextDirection';

const targets = [
  undefined,
  target('#target'),
  target(document.getElementById('target')!),
  target(() => document.getElementById('target')!),
  { current: document.getElementById('target') }
];
const element = document.getElementById('target')! as HTMLDivElement;

targets.forEach((target) => {
  describe(`${target}`, () => {
    it('Should use text direction', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('ltr');
      expect(result.current.remove).toBeTypeOf('function');
      expect(result.current.set).toBeTypeOf('function');
      if (!target) expect(result.current.ref).toBeTypeOf('function');

      expect(element.getAttribute('dir')).toBe('ltr');
    });

    it('Should return initial value', () => {
      element.setAttribute('dir', 'rtl');

      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('rtl');
      element.removeAttribute('dir');
    });

    it('Should set initial value', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target, 'rtl') as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>('rtl');
      });

      if (!target) act(() => result.current.ref(element));

      expect(result.current.value).toBe('rtl');
      element.removeAttribute('dir');
    });

    it('Should set the direction attribute on a element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      act(() => result.current.set('ltr'));

      expect(element.getAttribute('dir')).toBe('ltr');
      expect(result.current.value).toBe('ltr');

      act(() => result.current.set('rtl'));

      expect(element.getAttribute('dir')).toBe('rtl');
      expect(result.current.value).toBe('rtl');

      element.removeAttribute('dir');
    });

    it('Should remove the direction attribute on a element', () => {
      const { result } = renderHook(() => {
        if (target)
          return useTextDirection(target) as {
            ref: StateRef<HTMLDivElement>;
          } & UseTextDirectionReturn;
        return useTextDirection<HTMLDivElement>();
      });

      if (!target) act(() => result.current.ref(element));

      expect(element.getAttribute('dir')).toBe('ltr');
      expect(result.current.value).toBe('ltr');

      act(() => result.current.remove());

      expect(element.hasAttribute('dir')).toBeFalsy();
      expect(result.current.value).toBe('ltr');
    });
  });
});
