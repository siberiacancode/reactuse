import React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

it('Should use layout effect', () => {
  expect(useIsomorphicLayoutEffect).toBe(React.useLayoutEffect);
});
