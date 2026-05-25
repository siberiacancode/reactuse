import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useLogger } from './useLogger';

it('Should use logger', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');

  renderHook(() => useLogger('Component', [1, 2, 3]));

  expect(mockConsoleLog).toHaveBeenCalledWith('Component mounted', 1, 2, 3);
  expect(mockConsoleLog).toHaveBeenCalledOnce();
});

it('Should use logger on server side', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');

  renderHookServer(() => useLogger('Component', [1, 2, 3]));

  expect(mockConsoleLog).not.toHaveBeenCalled();
});

it('Should log unmount', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');

  const { unmount } = renderHook(() => useLogger('Component', [1, 2, 3]));

  unmount();
  expect(mockConsoleLog).toHaveBeenCalledWith('Component unmounted');
  expect(mockConsoleLog).toBeCalledTimes(2);
});

it('Should log on update', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');

  const { rerender } = renderHook(({ name, params }) => useLogger(name, params), {
    initialProps: { name: 'Component', params: [1, 2, 3] }
  });

  rerender({ name: 'Component', params: [4, 5, 6] });
  expect(mockConsoleLog).toBeCalledTimes(2);
  expect(mockConsoleLog).toHaveBeenCalledWith('Component updated', 4, 5, 6);
});

it('Should log on un mount', () => {
  const mockConsoleLog = vi.spyOn(console, 'log');

  const { unmount } = renderHook(() => useLogger('Component', []));

  unmount();

  expect(mockConsoleLog).toHaveBeenCalledWith('Component unmounted');
});
