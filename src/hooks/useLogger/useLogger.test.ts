import { renderHook } from '@testing-library/react';

import { useLogger } from './useLogger';

const mockConsoleLog = vi.spyOn(console, 'log');

afterEach(() => {
  vi.clearAllMocks();
});

it('Should use logger', () => {
  const { result } = renderHook(() => useLogger('Array', [1, 2, 3]));
  expect(result.current).toBe(undefined);
});

it('Should log mount and unmount messages', () => {
  const { unmount } = renderHook(() => useLogger('Component', [1, 2, 3]));

  expect(mockConsoleLog).toHaveBeenCalledWith('Component mounted', 1, 2, 3);

  unmount();
  expect(mockConsoleLog).toBeCalledTimes(2);
  expect(mockConsoleLog).toHaveBeenCalledWith('Component unmounted');
});

it('Should log mount and update messages', () => {
  const { rerender } = renderHook(({ name, params }) => useLogger(name, params), {
    initialProps: { name: 'Component', params: [1, 2, 3] }
  });

  expect(mockConsoleLog).toHaveBeenCalledWith('Component mounted', 1, 2, 3);

  rerender({ name: 'Component', params: [4, 5, 6] });
  expect(mockConsoleLog).toBeCalledTimes(2);
  expect(mockConsoleLog).toHaveBeenCalledWith('Component updated', 4, 5, 6);
});
