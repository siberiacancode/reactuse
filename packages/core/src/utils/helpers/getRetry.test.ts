import { getRetry } from './getRetry';

it('Should preserve a numeric retry limit', () => {
  expect(getRetry(3)).toBe(3);
  expect(getRetry(0)).toBe(0);
});

it('Should enable one retry', () => {
  expect(getRetry(true)).toBe(1);
});

it('Should disable retries', () => {
  expect(getRetry(false)).toBe(0);
});
