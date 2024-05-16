/**
 * @jest-environment node
 */

import React from 'react';

import { useIsomorphicEffect } from './useIsomorphicEffect';

it('Should use isomorphic effect', () => {
  expect(useIsomorphicEffect).toBe(React.useEffect);
});
