import { expect, it } from 'vitest';

import { shallowEqual } from './shallowEqual';

it('Should compare primitives', () => {
  expect(shallowEqual(1, 1)).toBe(true);
  expect(shallowEqual(1, 2)).toBe(false);
  expect(shallowEqual('a', 'a')).toBe(true);
  expect(shallowEqual('a', 'b')).toBe(false);
  expect(shallowEqual(true, true)).toBe(true);
  expect(shallowEqual(true, false)).toBe(false);
});

it('Should compare nullish values', () => {
  expect(shallowEqual(null, null)).toBe(true);
  expect(shallowEqual(undefined, undefined)).toBe(true);
  expect(shallowEqual(null, undefined)).toBe(false);
  expect(shallowEqual(null, {})).toBe(false);
  expect(shallowEqual(undefined, 0)).toBe(false);
});

it('Should not compare values of different types', () => {
  expect(shallowEqual(1, '1')).toBe(false);
  expect(shallowEqual(0, false)).toBe(false);
  expect(shallowEqual([], {})).toBe(false);
  expect(shallowEqual({}, [])).toBe(false);
});

it('Should compare arrays item by item', () => {
  expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(shallowEqual([1, 2, 3], [1, 2])).toBe(false);
  expect(shallowEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  expect(shallowEqual([], [])).toBe(true);
});

it('Should compare plain objects one level deep', () => {
  expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  expect(shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
  expect(shallowEqual({}, {})).toBe(true);
});

it('Should compare nested values by reference', () => {
  const nested = { c: 1 };

  expect(shallowEqual({ a: nested }, { a: nested })).toBe(true);
  expect(shallowEqual({ a: { c: 1 } }, { a: { c: 1 } })).toBe(false);
  expect(shallowEqual([[1]], [[1]])).toBe(false);
  expect(shallowEqual({ a: [1] }, { a: [1] })).toBe(false);
});

it('Should compare symbol keys', () => {
  const key = Symbol('key');

  expect(shallowEqual({ [key]: 1 }, { [key]: 1 })).toBe(true);
  expect(shallowEqual({ [key]: 1 }, { [key]: 2 })).toBe(false);
  expect(shallowEqual({ [key]: 1 }, {})).toBe(false);
});

it('Should treat NaN as equal to itself', () => {
  expect(shallowEqual(Number.NaN, Number.NaN)).toBe(true);
  expect(shallowEqual([Number.NaN], [Number.NaN])).toBe(true);
  expect(shallowEqual({ a: Number.NaN }, { a: Number.NaN })).toBe(true);
});

it('Should distinguish +0 and -0', () => {
  expect(shallowEqual(0, -0)).toBe(false);
  expect(shallowEqual({ a: 0 }, { a: -0 })).toBe(false);
  expect(shallowEqual([0], [-0])).toBe(false);
});

it('Should compare dates by time value', () => {
  expect(shallowEqual(new Date(1), new Date(1))).toBe(true);
  expect(shallowEqual(new Date(1), new Date(2))).toBe(false);
  expect(shallowEqual(new Date(Number.NaN), new Date(Number.NaN))).toBe(true);
  expect(shallowEqual({ at: new Date(1) }, { at: new Date(1) })).toBe(false);
});

it('Should compare regexps by source and flags', () => {
  expect(shallowEqual(/a/, /a/)).toBe(true);
  expect(shallowEqual(/a/, /b/)).toBe(false);
  expect(shallowEqual(/a/g, /a/i)).toBe(false);
  expect(shallowEqual({ pattern: /a/ }, { pattern: /a/ })).toBe(false);
});

it('Should compare sets by member identity', () => {
  const member = { id: 1 };

  expect(shallowEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
  expect(shallowEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
  expect(shallowEqual(new Set([1]), new Set([2]))).toBe(false);
  expect(shallowEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  expect(shallowEqual(new Set([member]), new Set([member]))).toBe(true);
  expect(shallowEqual(new Set([{ id: 1 }]), new Set([{ id: 1 }]))).toBe(false);
});

it('Should compare maps by value identity', () => {
  const value = { id: 1 };

  expect(shallowEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
  expect(shallowEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false);
  expect(shallowEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false);
  expect(shallowEqual(new Map([['a', 1]]), new Map())).toBe(false);
  expect(shallowEqual(new Map([['a', value]]), new Map([['a', value]]))).toBe(true);
  expect(shallowEqual(new Map([['a', { id: 1 }]]), new Map([['a', { id: 1 }]]))).toBe(false);
});

it('Should not equate different object types with the same keys', () => {
  expect(shallowEqual(new Date(1), /a/)).toBe(false);
  expect(shallowEqual(new Set([1]), new Map([['a', 1]]))).toBe(false);
  expect(shallowEqual(new Date(1), {})).toBe(false);
});

it('Should not equate a class instance with a plain object', () => {
  class Point {
    constructor(
      public x: number,
      public y: number
    ) {}
  }

  expect(shallowEqual(new Point(1, 2), new Point(1, 2))).toBe(true);
  expect(shallowEqual(new Point(1, 2), new Point(1, 3))).toBe(false);
  expect(shallowEqual(new Point(1, 2), { x: 1, y: 2 })).toBe(false);
});

it('Should handle circular references without recursion', () => {
  interface Node {
    self?: Node;
    value: number;
  }

  const a: Node = { value: 1 };
  a.self = a;
  const b: Node = { value: 1 };
  b.self = b;

  expect(shallowEqual(a, a)).toBe(true);
  expect(shallowEqual(a, b)).toBe(false);
});

it('Should compare functions by reference', () => {
  const callback = () => 1;

  expect(shallowEqual(callback, callback)).toBe(true);
  expect(
    shallowEqual(
      () => 1,
      () => 1
    )
  ).toBe(false);
  expect(shallowEqual({ callback }, { callback })).toBe(true);
});

it('Should compare errors by name and message', () => {
  expect(shallowEqual(new Error('a'), new Error('a'))).toBe(true);
  expect(shallowEqual(new Error('a'), new Error('b'))).toBe(false);
  expect(shallowEqual(new Error('a'), new TypeError('a'))).toBe(false);
});

it('Should not treat exotic objects without own keys as equal', () => {
  expect(shallowEqual(new ArrayBuffer(8), new ArrayBuffer(4))).toBe(false);
  expect(shallowEqual(new URL('https://a.dev'), new URL('https://b.dev'))).toBe(false);

  const first = document.createElement('div');
  const second = document.createElement('div');

  expect(shallowEqual(first, second)).toBe(false);
  expect(shallowEqual(first, first)).toBe(true);
  expect(shallowEqual({}, {})).toBe(true);
});
