import { act, renderHook } from '@testing-library/react';

import { useList } from './useList';

const INITIAL_LIST = ['a', 'b', 'c'];

it('Should use list', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  expect(result.current.value).toEqual(INITIAL_LIST);
  expect(result.current.push).toBeTypeOf('function');
  expect(result.current.removeAt).toBeTypeOf('function');
  expect(result.current.insertAt).toBeTypeOf('function');
  expect(result.current.updateAt).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
});

it('Should push item', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  act(() => result.current.push('d'));

  expect(result.current.value).toEqual([...INITIAL_LIST, 'd']);
});

it('Should remove item at index', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  act(() => result.current.removeAt(1));

  expect(result.current.value).toEqual(['a', 'c']);
});

it('Should insert item at index', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  act(() => result.current.insertAt(1, 'd'));

  expect(result.current.value).toEqual(['a', 'd', 'b', 'c']);
});

it('Should update item at index', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  act(() => result.current.updateAt(1, 'd'));

  expect(result.current.value).toEqual(['a', 'd', 'c']);
});

it('Should clear list', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  act(() => result.current.clear());

  expect(result.current.value).toEqual([]);
});

it('Should reset list', () => {
  const { result } = renderHook(() => useList(INITIAL_LIST));

  act(() => result.current.push('d'));
  act(() => result.current.reset());

  expect(result.current.value).toEqual(INITIAL_LIST);
});
