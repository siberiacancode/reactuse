import { expect, it } from 'vitest';

import { deepEqual } from './deepEqual';

it('Should compare primitives', () => {
  expect(deepEqual(1, 1)).toBe(true);
  expect(deepEqual(1, 2)).toBe(false);
  expect(deepEqual('a', 'a')).toBe(true);
  expect(deepEqual('a', 'b')).toBe(false);
  expect(deepEqual(true, true)).toBe(true);
  expect(deepEqual(true, false)).toBe(false);
});

it('Should compare nullish values', () => {
  expect(deepEqual(null, null)).toBe(true);
  expect(deepEqual(undefined, undefined)).toBe(true);
  expect(deepEqual(null, undefined)).toBe(false);
  expect(deepEqual(null, {})).toBe(false);
  expect(deepEqual(undefined, 0)).toBe(false);
});

it('Should not compare values of different types', () => {
  expect(deepEqual(1, '1')).toBe(false);
  expect(deepEqual(0, false)).toBe(false);
  expect(deepEqual([], {})).toBe(false);
  expect(deepEqual({}, [])).toBe(false);
});

it('Should compare arrays', () => {
  expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(deepEqual([1, 2, 3], [1, 2])).toBe(false);
  expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  expect(deepEqual([[1, [2]]], [[1, [2]]])).toBe(true);
  expect(deepEqual([[1, [2]]], [[1, [3]]])).toBe(false);
});

it('Should compare plain objects', () => {
  expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
  expect(deepEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
});

it('Should treat NaN as equal to itself', () => {
  expect(deepEqual(Number.NaN, Number.NaN)).toBe(true);
  expect(deepEqual([Number.NaN], [Number.NaN])).toBe(true);
  expect(deepEqual({ a: Number.NaN }, { a: Number.NaN })).toBe(true);
});

it('Should distinguish +0 and -0', () => {
  expect(deepEqual(0, -0)).toBe(false);
  expect(deepEqual({ a: 0 }, { a: -0 })).toBe(false);
});

it('Should compare dates by time value', () => {
  expect(deepEqual(new Date(1), new Date(1))).toBe(true);
  expect(deepEqual(new Date(1), new Date(2))).toBe(false);
  expect(deepEqual({ at: new Date(1) }, { at: new Date(2) })).toBe(false);
  expect(deepEqual(new Date(Number.NaN), new Date(Number.NaN))).toBe(true);
});

it('Should compare regexps by source and flags', () => {
  expect(deepEqual(/a/, /a/)).toBe(true);
  expect(deepEqual(/a/, /b/)).toBe(false);
  expect(deepEqual(/a/g, /a/i)).toBe(false);
  expect(deepEqual({ pattern: /a/ }, { pattern: /b/ })).toBe(false);
});

it('Should compare sets', () => {
  expect(deepEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
  expect(deepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
  expect(deepEqual(new Set([1]), new Set([2]))).toBe(false);
  expect(deepEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  expect(deepEqual(new Set(), new Set([1]))).toBe(false);
});

it('Should compare maps', () => {
  expect(deepEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
  expect(deepEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false);
  expect(deepEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false);
  expect(deepEqual(new Map([['a', 1]]), new Map())).toBe(false);
  expect(deepEqual(new Map([['a', { b: 1 }]]), new Map([['a', { b: 1 }]]))).toBe(true);
});

it('Should not equate different object types with the same keys', () => {
  expect(deepEqual(new Date(1), /a/)).toBe(false);
  expect(deepEqual(new Set([1]), new Map([['a', 1]]))).toBe(false);
  expect(deepEqual(new Date(1), {})).toBe(false);
});

it('Should not equate a class instance with a plain object', () => {
  class Point {
    constructor(
      public x: number,
      public y: number
    ) {}
  }

  expect(deepEqual(new Point(1, 2), new Point(1, 2))).toBe(true);
  expect(deepEqual(new Point(1, 2), new Point(1, 3))).toBe(false);
  expect(deepEqual(new Point(1, 2), { x: 1, y: 2 })).toBe(false);
});

it('Should handle circular references', () => {
  interface Node {
    self?: Node;
    value: number;
  }

  const a: Node = { value: 1 };
  a.self = a;
  const b: Node = { value: 1 };
  b.self = b;
  const c: Node = { value: 2 };
  c.self = c;

  expect(deepEqual(a, b)).toBe(true);
  expect(deepEqual(a, c)).toBe(false);
});

it('Should handle mutually circular references', () => {
  const createPair = () => {
    const left: any = { name: 'left' };
    const right: any = { name: 'right', left };
    left.right = right;
    return left;
  };

  expect(deepEqual(createPair(), createPair())).toBe(true);
});

it('Should compare functions by reference', () => {
  const callback = () => 1;

  expect(deepEqual(callback, callback)).toBe(true);
  expect(
    deepEqual(
      () => 1,
      () => 1
    )
  ).toBe(false);
});

it('Should compare errors by name and message', () => {
  expect(deepEqual(new Error('a'), new Error('a'))).toBe(true);
  expect(deepEqual(new Error('a'), new Error('b'))).toBe(false);
  expect(deepEqual(new Error('a'), new TypeError('a'))).toBe(false);
});

it('Should not treat exotic objects without own keys as equal', () => {
  expect(deepEqual(new ArrayBuffer(8), new ArrayBuffer(4))).toBe(false);
  expect(deepEqual(new URL('https://a.dev'), new URL('https://b.dev'))).toBe(false);

  const first = document.createElement('div');
  const second = document.createElement('div');

  expect(deepEqual(first, second)).toBe(false);
  expect(deepEqual(first, first)).toBe(true);
  expect(deepEqual({}, {})).toBe(true);
});

it('Should compare set members by reference', () => {
  const member = { a: 1 };

  expect(deepEqual(new Set([member]), new Set([member]))).toBe(true);
  expect(deepEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(false);
  expect(deepEqual(new Set([{ a: 1 }, { a: 1 }]), new Set([{ a: 1 }, { a: 2 }]))).toBe(false);
});

it('Should not report a pair as equal after it compared unequal', () => {
  const first = { v: 1 };
  const second = { v: 2 };

  expect(
    deepEqual(
      { set: new Set([first, second]), value: first },
      { set: new Set([{ v: 2 }, { v: 1 }]), value: { v: 2 } }
    )
  ).toBe(false);
});
