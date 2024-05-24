import { useIsClient } from './useIsClient';

it('Should be true when rendering client side', () => {
  expect(useIsClient()).toBe(true);
});
