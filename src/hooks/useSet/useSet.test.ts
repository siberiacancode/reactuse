import { act, renderHook } from '@testing-library/react';
import 'core-js/proposals/set-methods-v2';

import { useSet } from './useSet';

it('Should use set', () => {
  const { result } = renderHook(() => useSet([1, 2, 3]));
  const set = result.current;

  expect(set.size).toBe(3);
  expect(typeof set.clear).toBe('function');
  expect(typeof set.remove).toBe('function');
  expect(typeof set.add).toBe('function');
  expect(typeof set.toggle).toBe('function');
  expect(typeof set.union).toBe('function');
  expect(typeof set.difference).toBe('function');
  expect(typeof set.symmetricDifference).toBe('function');
  expect(typeof set.intersection).toBe('function');
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
