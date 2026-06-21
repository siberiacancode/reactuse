import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWindowScroll } from './useWindowScroll';

it('Should use window scroll', () => {
  const { result } = renderHook(useWindowScroll);

  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.snapshot.x).toEqual(window.scrollX);
  expect(result.current.snapshot.y).toEqual(window.scrollY);
  expect(result.current.scrollTo).toBeTypeOf('function');
});

it('Should use window scroll on server side', () => {
  const { result } = renderHookServer(useWindowScroll);

  expect(result.current.watch).toBeTypeOf('function');
  expect(result.current.snapshot.x).toEqual(Number.POSITIVE_INFINITY);
  expect(result.current.snapshot.y).toEqual(Number.POSITIVE_INFINITY);
  expect(result.current.scrollTo).toBeTypeOf('function');
});

it('Should return reactive value on scroll', () => {
  window.scrollX = 0;
  window.scrollY = 0;

  const { result } = renderHook(useWindowScroll);

  act(() => result.current.watch());

  act(() => {
    window.scrollX = 50;
    window.scrollY = 75;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.snapshot).toEqual({ x: 50, y: 75 });
});

it('Should call callback on scroll', () => {
  const callback = vi.fn();

  window.scrollX = 0;
  window.scrollY = 0;

  renderHook(() => useWindowScroll(callback));

  act(() => {
    window.scrollX = 50;
    window.scrollY = 75;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith({ x: 50, y: 75 }, expect.any(Event));
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(useWindowScroll);

  expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
});
