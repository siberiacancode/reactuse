import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWindowScroll } from './useWindowScroll';

it('Should use window scroll', () => {
  const { result } = renderHook(useWindowScroll);

  expect(result.current.value.x).toEqual(window.scrollX);
  expect(result.current.value.y).toEqual(window.scrollY);
  expect(result.current.scrollTo).toBeTypeOf('function');
});

it('Should use window scroll on server side', () => {
  const { result } = renderHookServer(useWindowScroll);

  expect(result.current.value.x).toEqual(Number.POSITIVE_INFINITY);
  expect(result.current.value.y).toEqual(Number.POSITIVE_INFINITY);
  expect(result.current.scrollTo).toBeTypeOf('function');
});

it('Should update value on resize', () => {
  const { result } = renderHook(useWindowScroll);

  act(() => {
    window.scrollX = 15;
    window.scrollY = 25;
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current.value).toEqual({ x: 15, y: 25 });
});

it('Should update value on scroll', () => {
  const { result } = renderHook(useWindowScroll);

  act(() => {
    window.scrollX = 50;
    window.scrollY = 75;
    window.dispatchEvent(new Event('scroll'));
  });

  expect(result.current.value).toEqual({ x: 50, y: 75 });
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
