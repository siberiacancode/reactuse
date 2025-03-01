import { renderHook } from '@testing-library/react';

import { useLess } from './useLess';

it('Should use less', () => {
  const { result } = renderHook(() => useLess('value'));

  expect(result.current).toBe('value');
});

it('Should log a warning when useLess is used', () => {
  const mockConsoleWarn = vi.spyOn(console, 'warn');
  renderHook(() => useLess());

  expect(mockConsoleWarn).toHaveBeenCalledWith("Warning: You forgot to delete the 'useLess' hook.");
  mockConsoleWarn.mockRestore();
});
