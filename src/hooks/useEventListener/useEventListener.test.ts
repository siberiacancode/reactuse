import { act, renderHook } from '@testing-library/react';

import { useEventListener } from './useEventListener';

it('Should use event listener', () => {
  const { result } = renderHook(() => useEventListener('click', vi.fn));

  expect(result.current).toEqual({ current: null });
});

it('Should call passed callback', () => {
  const callback = vi.fn();
  renderHook(() => useEventListener(document, 'click', callback));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should track multiple events', () => {
  const callback = vi.fn();
  renderHook(() => useEventListener(document, ['click', 'keydown'], callback));

  expect(callback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);

  act(() => document.dispatchEvent(new Event('keydown')));

  expect(callback).toBeCalledTimes(2);
});

it('Should call the most recent callback', () => {
  const firstCallback = vi.fn();
  const { rerender } = renderHook((callback) => useEventListener(document, 'click', callback), {
    initialProps: firstCallback
  });

  expect(firstCallback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(firstCallback).toBeCalledTimes(1);

  const secondCallback = vi.fn();
  rerender(secondCallback);

  expect(secondCallback).not.toBeCalled();

  act(() => document.dispatchEvent(new Event('click')));

  expect(secondCallback).toBeCalledTimes(1);
});

it('Should remove event listener on unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useEventListener(document, 'click', callback));

  unmount();
  act(() => document.dispatchEvent(new Event('click')));
  expect(callback).not.toBeCalled();
});

it('Should remove event listener on unmount with multiple events', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useEventListener(document, ['click', 'keydown'], callback));

  unmount();
  act(() => document.dispatchEvent(new Event('click')));
  act(() => document.dispatchEvent(new Event('keydown')));
  expect(callback).not.toBeCalled();
});

it('Should work with dom element', () => {
  const callback = vi.fn();
  const element = document.createElement('div');
  const { unmount } = renderHook(() => useEventListener(element, 'click', callback));

  act(() => element.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);

  unmount();
  act(() => element.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should work with react ref', () => {
  const callback = vi.fn();
  const ref = { current: document.createElement('div') };
  const { unmount } = renderHook(() => useEventListener(ref, 'click', callback));

  act(() => ref.current.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);

  unmount();
  act(() => ref.current.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});

it('Should work with returned ref', () => {
  const callback = vi.fn();

  const element = document.createElement('div');
  const { unmount } = renderHook(() => {
    const ref = useEventListener<HTMLDivElement>('click', callback);
    Object.assign(ref, { current: element });

    return ref;
  });

  act(() => element.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);

  unmount();

  act(() => element.dispatchEvent(new Event('click')));

  expect(callback).toBeCalledTimes(1);
});
