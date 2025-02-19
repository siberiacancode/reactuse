import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useMap } from '@/hooks/useMap/useMap';

it('Should use map', () => {
  const { result } = renderHook(() => useMap());

  expect(result.current.value).toEqual(new Map());
  expect(result.current.size).toBe(0);
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useMap([['value', 1]]));

  expect(result.current.value).toEqual(new Map([['value', 1]]));
  expect(result.current.size).toBe(1);
});

it('Should change value with set', () => {
  const { result } = renderHook(() => useMap([['value', 1]]));

  act(() => result.current.set('value', 2));
  expect(result.current.value).toEqual(new Map([['value', 2]]));
  expect(result.current.size).toBe(1);
});

it('Should add new value', () => {
  const { result } = renderHook(() => useMap([['Dima', 25]]));

  expect(result.current.size).toBe(1);

  act(() => result.current.set('Alex', 15));
  expect(result.current.value).toEqual(
    new Map([
      ['Dima', 25],
      ['Alex', 15]
    ])
  );
  expect(result.current.size).toBe(2);
});

it('Should remove value', () => {
  const { result } = renderHook(() => useMap([['value', 1]]));

  expect(result.current.size).toBe(1);
  act(() => result.current.remove('value'));

  expect(result.current.value).toEqual(new Map([]));
  expect(result.current.size).toBe(0);
});

it('Should return value of exist', () => {
  const { result } = renderHook(() => useMap([['value', 1]]));

  expect(result.current.has('value')).toEqual(true);
  expect(result.current.has('non-exist')).toEqual(false);
});

it('Should clear the map', () => {
  const { result } = renderHook(() => useMap([['value', 1]]));

  expect(result.current.size).toBe(1);

  act(() => result.current.clear());

  expect(result.current.size).toBe(0);
});

it('Should reset the map', () => {
  const { result } = renderHook(() => useMap([['value', 1]]));

  expect(result.current.size).toBe(1);

  act(() => result.current.clear());

  expect(result.current.value).toEqual(new Map([]));
  expect(result.current.size).toBe(0);

  act(() => result.current.reset());

  expect(result.current.value).toEqual(new Map([['value', 1]]));
  expect(result.current.size).toBe(1);
});
