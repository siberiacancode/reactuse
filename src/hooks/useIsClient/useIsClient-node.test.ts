/**
 * @jest-environment node
 */

import { useIsClient } from './useIsClient';

it('Should be true when rendering server side', () => {
  expect(useIsClient()).toBe(false);
});
