import { expect, it, vi } from 'vitest';

import { makeDestructurable } from './makeDestructurable';

it('Should make destructurable', () => {
  const inc = vi.fn();
  const dec = vi.fn();
  const actions = { inc, dec };
  const result = makeDestructurable({ value: 10, inc, dec }, [10, actions] as const);

  expect(result.value).toBe(10);
  expect(result.inc).toBe(inc);
  expect(result.dec).toBe(dec);

  const [value, destructuredActions] = result;
  expect(value).toBe(10);
  expect(destructuredActions).toBe(actions);
  expect([...result]).toStrictEqual([10, actions]);
});

it('Should support repeated array destructuring', () => {
  const actions = { inc: vi.fn(), dec: vi.fn() };
  const result = makeDestructurable({ value: 10 }, [10, actions] as const);

  const [firstValue, firstActions] = result;
  const [secondValue, secondActions] = result;

  expect([firstValue, firstActions]).toStrictEqual([10, actions]);
  expect([secondValue, secondActions]).toStrictEqual([10, actions]);
});

it('Should exclude the iterator from enumerable object properties', () => {
  const object = { value: 10 };
  const result = makeDestructurable(object, [10] as const);

  expect({ ...result }).toStrictEqual(object);
});

it('Should make destructurable without Symbol support', () => {
  const actions = { inc: vi.fn(), dec: vi.fn() };
  vi.stubGlobal('Symbol', undefined);

  const result = makeDestructurable({ value: 10 }, [10, actions] as const);
  vi.unstubAllGlobals();

  const [value, destructuredActions] = result;
  expect(result.value).toBe(10);
  expect(value).toBe(10);
  expect(destructuredActions).toBe(actions);
});
