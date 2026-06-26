import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useCycleList } from './useCycleList';

const INITIAL_LIST = ['foo', 'bar', 'fooBar'];

it('Should use cycle list', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  expect(result.current.value).toBe('foo');
  expect(result.current.index).toBe(0);
  expect(result.current.next).toBeTypeOf('function');
  expect(result.current.prev).toBeTypeOf('function');
  expect(result.current.go).toBeTypeOf('function');
});

it('Should use cycle list on server side', () => {
  const { result } = renderHookServer(() => useCycleList(INITIAL_LIST));

  expect(result.current.value).toBe('foo');
  expect(result.current.index).toBe(0);
  expect(result.current.next).toBeTypeOf('function');
  expect(result.current.prev).toBeTypeOf('function');
  expect(result.current.go).toBeTypeOf('function');
});

it('Should set initial index', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST, 1));

  expect(result.current.value).toBe('bar');
  expect(result.current.index).toBe(1);
});

it('Should normalize initial index', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST, -1));

  expect(result.current.value).toBe('fooBar');
  expect(result.current.index).toBe(2);
});

it('Should go to the next item', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  act(result.current.next);

  expect(result.current.value).toBe('bar');
  expect(result.current.index).toBe(1);
});

it('Should go to the previous item', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  act(result.current.prev);

  expect(result.current.value).toBe('fooBar');
  expect(result.current.index).toBe(2);
});

it('Should go to the next item by custom step', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  act(() => result.current.next(2));

  expect(result.current.value).toBe('fooBar');
  expect(result.current.index).toBe(2);
});

it('Should go to the previous item by custom step', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  act(() => result.current.prev(2));

  expect(result.current.value).toBe('bar');
  expect(result.current.index).toBe(1);
});

it('Should go to a specific index', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  act(() => result.current.go(2));

  expect(result.current.value).toBe('fooBar');
  expect(result.current.index).toBe(2);
});

it('Should normalize target index', () => {
  const { result } = renderHook(() => useCycleList(INITIAL_LIST));

  act(() => result.current.go(-1));
  expect(result.current.value).toBe('fooBar');
  expect(result.current.index).toBe(2);

  act(() => result.current.go(3));
  expect(result.current.value).toBe('foo');
  expect(result.current.index).toBe(0);
});

it('Should normalize index when list length changes', () => {
  const { result, rerender } = renderHook(({ list }) => useCycleList(list), {
    initialProps: { list: INITIAL_LIST }
  });

  act(() => result.current.go(2));
  rerender({ list: ['foo', 'bar'] });

  expect(result.current.value).toBe('foo');
  expect(result.current.index).toBe(0);
});
