import { renderHook } from '@testing-library/react';

import { useFul } from './useFul';

it('Should use ful', () => {
  const { result } = renderHook(() => useFul('value'));

  expect(result.current).toBe('value');
});

it('Should log a warning when useFul is used', () => {
  const mockConsoleWarn = vi.spyOn(console, 'warn');
  renderHook(() => useFul());

  expect(mockConsoleWarn).toHaveBeenCalledWith("Warning: You forgot to delete the 'useFul' hook.");
  mockConsoleWarn.mockRestore();
});
