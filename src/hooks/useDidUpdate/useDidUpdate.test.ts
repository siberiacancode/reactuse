import { renderHook } from '@testing-library/react';

import { useDidUpdate } from './useDidUpdate';

it('Should use did update', () => {
  const effect = vi.fn();
  renderHook(() => useDidUpdate(effect, []));

  expect(effect).not.toHaveBeenCalled();
});

it('Should call effect on subsequent updates when dependencies change', () => {
  const effect = vi.fn();
  const { rerender } = renderHook(({ deps }) => useDidUpdate(effect, deps), {
    initialProps: { deps: [1] }
  });

  expect(effect).not.toHaveBeenCalled();

  rerender({ deps: [1] });
  expect(effect).not.toHaveBeenCalled();

  rerender({ deps: [2] });
  expect(effect).toHaveBeenCalledTimes(1);

  rerender({ deps: [3] });
  expect(effect).toHaveBeenCalledTimes(2);
});

it('Should call effect on subsequent updates when dependencies change', () => {
  const effect = vi.fn();
  const { rerender } = renderHook(() => useDidUpdate(effect));

  expect(effect).not.toHaveBeenCalled();

  rerender();
  expect(effect).toHaveBeenCalledTimes(1);

  rerender();
  expect(effect).toHaveBeenCalledTimes(2);
});
