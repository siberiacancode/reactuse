import { act } from 'react';
import { renderHook } from '@testing-library/react';

import { useMap } from '@/hooks/useMap/useMap';

const DEFAULT_VALUE: [string, number][] = [
  ['Dima', 25],
  ['Danila', 1]
];

it('Should use map', () => {
  const { result } = renderHook(() => useMap());

  expect(typeof result.current.value).toBe('object');
  expect(typeof result.current.size).toBe('number');
  expect(typeof result.current.set).toBe('function');
  expect(typeof result.current.remove).toBe('function');
  expect(typeof result.current.clear).toBe('function');
  expect(typeof result.current.reset).toBe('function');
});

it('Should initialize an empty map', () => {
  const { result } = renderHook(() => useMap());

  expect(result.current.value).toEqual(new Map());
  expect(result.current.size).toBe(0);
});

it('Should use map with initial value', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.value).toEqual(new Map(DEFAULT_VALUE));
  expect(result.current.size).toBe(2);
});

it('Should use map with change value', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  act(() => result.current.set('Dima', 30));
  expect(result.current.value).toEqual(
    new Map([
      ['Dima', 30],
      ['Danila', 1]
    ])
  );
  expect(result.current.size).toBe(2);
});

it('Should use map with add new value', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.value).toEqual(new Map(DEFAULT_VALUE));
  expect(result.current.size).toBe(2);

  act(() => result.current.set('Alex', 15));

  expect(result.current.value).toEqual(new Map([...DEFAULT_VALUE, ['Alex', 15]]));
  expect(result.current.size).toBe(3);
});

it('Should use map with remove  value', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.value).toEqual(new Map(DEFAULT_VALUE));
  expect(result.current.size).toBe(2);

  act(() => result.current.remove('Dima'));

  expect(result.current.value).toEqual(new Map([['Danila', 1]]));
  expect(result.current.size).toBe(1);
});

it('Should use map return true if key exist', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.has('Dima')).toEqual(true);
});

it('Should use map return false if key not exist', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.has('Alex')).toEqual(false);
});

it('Should use map clear the map', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.size).toBe(2);

  act(() => result.current.clear());

  expect(result.current.size).toBe(0);
});

it('Should use map reset the map', () => {
  const { result } = renderHook(() => useMap(DEFAULT_VALUE));

  expect(result.current.size).toBe(2);

  act(() => result.current.remove('Dima'));

  expect(result.current.value).toEqual(new Map([['Danila', 1]]));
  expect(result.current.size).toBe(1);

  act(() => result.current.reset());

  expect(result.current.value).toEqual(new Map(DEFAULT_VALUE));
  expect(result.current.size).toBe(2);
});
