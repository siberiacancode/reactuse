/**
 * @jest-environment node
 */

import { useEffect } from 'react';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

it('Should use effect', () => {
  expect(useIsomorphicLayoutEffect).toBe(useEffect);
});
