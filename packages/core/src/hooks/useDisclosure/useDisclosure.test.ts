import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDisclosure } from './useDisclosure';

it('Should use counter', () => {
  const { result } = renderHook(useDisclosure);

  expect(result.current.opened).toBeFalsy();
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should use disclosure on server side', () => {
  const { result } = renderHookServer(useDisclosure);

  expect(result.current.opened).toBeFalsy();
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
  expect(result.current.toggle).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useDisclosure(true));

  expect(result.current.opened).toBeTruthy();
});

it('Should toggle boolean', () => {
  const { result } = renderHook(useDisclosure);

  act(result.current.toggle);
  expect(result.current.opened).toBeTruthy();

  act(result.current.toggle);
  expect(result.current.opened).toBeFalsy();
});

it('Should toggle boolean with value', () => {
  const { result } = renderHook(useDisclosure);

  act(() => result.current.toggle(true));
  expect(result.current.opened).toBeTruthy();

  act(() => result.current.toggle(false));
  expect(result.current.opened).toBeFalsy();
});

it('Should change value after open', () => {
  const { result } = renderHook(useDisclosure);

  act(result.current.open);
  expect(result.current.opened).toBeTruthy();
});

it('Should change value after close', () => {
  const { result } = renderHook(() => useDisclosure(true));

  act(result.current.close);
  expect(result.current.opened).toBeFalsy();
});
