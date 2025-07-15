import { act, renderHook } from '@testing-library/react';

import { useShallowEffect } from './useShallowEffect';

it('Should use shallow effect', () => {
  const effect = vi.fn();

  renderHook(() => useShallowEffect(effect, []));

  expect(effect).toHaveBeenCalledOnce();
});

it('Should not run effect when deps are shallow equal', () => {
  const effect = vi.fn();
  let object = { a: 'a', b: 'b' };

  const { rerender } = renderHook(() => useShallowEffect(effect, [object]));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { b: 'b', a: 'a' };
    rerender();
  });

  expect(effect).toHaveBeenCalledOnce();
});

it('Should run effect when deps change', () => {
  const effect = vi.fn();
  let object = { a: 'a' };

  const { rerender } = renderHook(() => useShallowEffect(effect, [object]));

  expect(effect).toHaveBeenCalledOnce();

  act(() => {
    object = { a: 'b' };
    rerender();
  });

  expect(effect).toBeCalledTimes(2);
});
