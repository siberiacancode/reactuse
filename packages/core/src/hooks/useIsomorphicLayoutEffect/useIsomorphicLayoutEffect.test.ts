import { useLayoutEffect } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

it('Should use layout effect', () => {
  expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
});
