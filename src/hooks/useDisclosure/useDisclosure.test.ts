import { act, renderHook } from '@testing-library/react';

import { useDisclosure } from './useDisclosure';

it('Should use counter', () => {
  const { result } = renderHook(useDisclosure);

  expect(result.current.opened).toBeFalsy();
  expect(typeof result.current.open).toBe('function');
  expect(typeof result.current.close).toBe('function');
  expect(typeof result.current.toggle).toBe('function');
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
