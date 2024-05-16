import { useCounter } from '../useCounter/useCounter';

import { useNumber } from './useNumber';

it('Should be an alias for useCounter', () => {
  expect(useNumber).toBe(useCounter);
});
