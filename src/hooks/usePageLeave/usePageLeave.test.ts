import { act, fireEvent, renderHook } from '@testing-library/react';

import { usePageLeave } from './usePageLeave';

it('Should use page leave', () => {
  const callback = vi.fn();
  renderHook(() => usePageLeave(callback));

  act(() => fireEvent.mouseLeave(document));
  expect(callback).toBeCalledTimes(1);

  act(() => fireEvent.mouseEnter(document));

  act(() => fireEvent.mouseLeave(document));
  expect(callback).toBeCalledTimes(2);
});
