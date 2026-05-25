/**
 * @jest-environment node
 */

import { useEffect } from 'react';

import { renderHookServer } from '@/tests';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

it('Should use effect', () => {
  expect(useIsomorphicLayoutEffect).toBe(useEffect);
});

it('Should use effect on server side', () => {
  const effect = vi.fn();
  renderHookServer(() => useIsomorphicLayoutEffect(effect, []));

  expect(effect).not.toHaveBeenCalled();
});
