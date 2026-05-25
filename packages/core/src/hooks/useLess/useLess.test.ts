import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useLess } from './useLess';

it('Should use less', () => {
  const { result } = renderHook(() => useLess('value'));

  expect(result.current).toBe('value');
});

it('Should use less on server side', () => {
  const { result } = renderHookServer(() => useLess('value'));

  expect(result.current).toBe('value');
});

it('Should log a warning when useLess is used', () => {
  const mockConsoleWarn = vi.spyOn(console, 'warn');
  renderHook(() => useLess());

  expect(mockConsoleWarn).toHaveBeenCalledWith("Warning: You forgot to delete the 'useLess' hook.");
  mockConsoleWarn.mockRestore();
});
