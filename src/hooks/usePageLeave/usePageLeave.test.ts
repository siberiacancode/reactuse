import { act, renderHook } from '@testing-library/react';

import { usePageLeave } from './usePageLeave';

it('Should use page leave', () => {
  const callback = vi.fn();
  renderHook(() => usePageLeave(callback));

  act(() => document.dispatchEvent(new Event('mouseleave')));
  expect(callback).toBeCalledTimes(1);

  act(() => document.dispatchEvent(new Event('mouseenter')));

  act(() => document.dispatchEvent(new Event('mouseleave')));
  expect(callback).toBeCalledTimes(2);
});
