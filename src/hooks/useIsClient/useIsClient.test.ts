import { renderHook } from '@testing-library/react';

import { renderHookServer } from '../../utils/renderHookServer';

import { useIsClient } from './useIsClient';

it('should be true when rendering client-side', () => {
  const { result } = renderHook(() => useIsClient());
  expect(result.current).toBe(true);
});

it('should be false when rendering server-side', () => {
  const { result } = renderHookServer(() => useIsClient());
  expect(result.current).toBe(false);
});
