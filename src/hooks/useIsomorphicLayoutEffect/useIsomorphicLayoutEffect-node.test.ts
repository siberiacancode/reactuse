/**
 * @jest-environment node
 */

import React from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

it('Should use effect', () => {
  expect(useIsomorphicLayoutEffect).toBe(React.useEffect);
});
