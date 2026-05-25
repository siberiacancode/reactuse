import { useLayoutEffect } from 'react';

import { renderHookServer } from '@/tests';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

it('Should use layout effect', () => {
  expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
});

it('Should use layout effect on server side', () => {
  const effect = vi.fn();
  renderHookServer(() => useIsomorphicLayoutEffect(effect, []));

  expect(effect).not.toHaveBeenCalled();
});
