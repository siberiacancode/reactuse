import { act, fireEvent, renderHook } from '@testing-library/react';

import { usePageLeave } from './usePageLeave';

it('Should callback after the mouse has moved off the page', () => {
  const callback = vi.fn();
  renderHook(() => usePageLeave(callback));

  act(() => fireEvent.mouseLeave(document));

  expect(callback).toBeCalledTimes(1);
});

it("Shouldn't callback after the mouse has moved to the page", () => {
  const callback = vi.fn();
  renderHook(() => usePageLeave(callback));

  act(() => fireEvent.mouseEnter(document));

  expect(callback).not.toBeCalled();
});

it('Should be called more than once when the mouse goes off the page repeatedly', () => {
  const callback = vi.fn();
  renderHook(() => usePageLeave(callback));

  act(() => fireEvent.mouseLeave(document));

  expect(callback).toBeCalledTimes(1);

  act(() => fireEvent.mouseEnter(document));
  act(() => fireEvent.mouseLeave(document));

  expect(callback).toBeCalledTimes(2);
});
