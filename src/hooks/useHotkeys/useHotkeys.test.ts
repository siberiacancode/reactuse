import { act, renderHook } from '@testing-library/react';

import { useHotkeys } from './useHotkeys';

it('Should use hotkeys', () => {
  const callback = vi.fn();

  renderHook(() => useHotkeys('a', callback, { target: document }));

  expect(callback).not.toBeCalled();
});

it('The callback should be called when the hotkey is pressed', () => {
  const callback = vi.fn();

  renderHook(() => useHotkeys('a', callback, { target: document }));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })));

  expect(callback).toBeCalledTimes(1);
});

it("Shouldn't call callback when clicking outside of target", () => {
  const callback = vi.fn();

  renderHook(() => useHotkeys('a', callback, { target: document }));

  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })));

  expect(callback).not.toBeCalled();
});
