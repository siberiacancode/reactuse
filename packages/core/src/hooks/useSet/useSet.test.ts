import { act, renderHook } from '@testing-library/react';
import 'core-js/proposals/set-methods-v2';

import { useSet } from './useSet';

it('Should use set', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));
  const set = result.current;

  expect(set.size).toBe(3);
  expect(set.clear).toBeTypeOf('function');
  expect(set.remove).toBeTypeOf('function');
  expect(set.add).toBeTypeOf('function');
  expect(set.toggle).toBeTypeOf('function');
  expect(set.union).toBeTypeOf('function');
  expect(set.difference).toBeTypeOf('function');
  expect(set.symmetricDifference).toBeTypeOf('function');
  expect(set.intersection).toBeTypeOf('function');
});

it('Should has value', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  expect(result.current.has(3)).toBeTruthy();
  expect(result.current.has(4)).toBeFalsy();
});

it('Should add a new value', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.add(4));

  expect(result.current.value).toEqual(new Set([1, 2, 3, 4]));
});

it('Should remove a value', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.remove(3));

  expect(result.current.value).toEqual(new Set([1, 2]));
});

it('Should clear all values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.clear());

  expect(result.current.value).toEqual(new Set([]));
});

it('Should toggle all values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.toggle(3));

  expect(result.current.value).toEqual(new Set([1, 2]));

  act(() => result.current.toggle(3));

  expect(result.current.value).toEqual(new Set([1, 2, 3]));
});

it('Should union values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.union(new Set([4, 5, 6])));

  expect(result.current.value).toEqual(new Set([1, 2, 3, 4, 5, 6]));
});

it('Should intersection values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.intersection(new Set([2, 3, 4])));

  expect(result.current.value).toEqual(new Set([2, 3]));
});

it('Should difference values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.difference(new Set([3, 4, 6])));

  expect(result.current.value).toEqual(new Set([1, 2]));
});

it('Should symmetric difference values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.symmetricDifference(new Set([2, 3, 4])));

  expect(result.current.value).toEqual(new Set([1, 4]));
});

it('Should reset values', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));

  act(() => result.current.reset());

  expect(result.current.value).toEqual(new Set([1, 2, 3]));
});
