import { expect, it, vi } from 'vitest';

import { makeDestructurable } from './makeDestructurable';

it('Should make destructurable', () => {
  const result = makeDestructurable({ value: 10, inc: vi.fn(), dec: vi.fn() }, [
    10,
    { inc: vi.fn(), dec: vi.fn() }
  ] as const);

  expect(result.value).toBe(10);
  expect(result.inc).toBeTypeOf('function');
  expect(result.dec).toBeTypeOf('function');

  const [value, actions] = [...result];
  expect(value).toBe(10);
  expect(actions).toMatchObject({
    inc: expect.any(Function),
    dec: expect.any(Function)
  });
});
