import { act, renderHook } from '@testing-library/react';

import { useWindowSize } from './useWindowSize';

it('Should use window size', () => {
  Object.assign(window, { innerHeight: 100, innerWidth: 100 });
  const { result } = renderHook(useWindowSize);

  expect(result.current).toEqual({ width: 100, height: 100 });
});

it('Should change state upon resize events', () => {
  Object.assign(window, { innerHeight: 100, innerWidth: 100 });
  const { result } = renderHook(useWindowSize);

  expect(result.current).toEqual({ width: 100, height: 100 });

  act(() => {
    Object.assign(window, { innerHeight: 50, innerWidth: 50 });
    window.dispatchEvent(new Event('resize'));
  });

  expect(result.current).toEqual({ width: 50, height: 50 });
});
