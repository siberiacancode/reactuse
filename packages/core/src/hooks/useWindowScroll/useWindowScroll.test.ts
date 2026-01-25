import { renderHook } from '@testing-library/react';

import { useWindowScroll } from './useWindowScroll';

const mockScrollTo = vi.fn();

beforeAll(() => {
  vi.stubGlobal('scrollTo', mockScrollTo);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

it('Should use window scroll', () => {
  const { result } = renderHook(() => useWindowScroll());

  expect(result.current.value).toEqual({ x: 0, y: 0 });

  result.current.scrollTo({ x: 100, y: 100 });

  expect(globalThis.scrollTo).toBeCalledWith({ left: 100, top: 100, behavior: 'smooth' });
});
