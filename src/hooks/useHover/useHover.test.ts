import { act, renderHook } from '@testing-library/react';

import { useHover } from './useHover';

it('Should use hover', () => {
  const onEntry = vi.fn();
  const onLeave = vi.fn();

  const { result } = renderHook(() => useHover({ onEntry, onLeave }));

  expect(result.current[0]).toEqual({ current: undefined });
  expect(result.current[1]).toBeFalsy();
  expect(onEntry).not.toBeCalled();
  expect(onLeave).not.toBeCalled();
});

it('Should change state when entering and leaving the element', () => {
  const element = document.createElement('div');
  const onEntry = vi.fn();
  const onLeave = vi.fn();

  const { result } = renderHook(() => useHover(element, { onEntry, onLeave }));

  expect(result.current).toBeFalsy();
  expect(onEntry).not.toBeCalled();
  expect(onLeave).not.toBeCalled();

  act(() => element.dispatchEvent(new Event('mouseenter')));
  expect(result.current).toBeTruthy();
  expect(onEntry).toBeCalledTimes(1);
  expect(onLeave).not.toBeCalled();

  act(() => element.dispatchEvent(new Event('mouseleave')));
  expect(result.current).toBeFalsy();
  expect(onEntry).toBeCalledTimes(1);
  expect(onLeave).toBeCalledTimes(1);
});

it('Should change state when entering and leaving the ref', () => {
  const element = document.createElement('div');
  const ref = { current: element };
  const onEntry = vi.fn();
  const onLeave = vi.fn();

  const { result } = renderHook(() => useHover(ref, { onEntry, onLeave }));

  expect(result.current).toBeFalsy();
  expect(onEntry).not.toBeCalled();
  expect(onLeave).not.toBeCalled();

  act(() => element.dispatchEvent(new Event('mouseenter')));
  expect(result.current).toBeTruthy();
  expect(onEntry).toBeCalledTimes(1);
  expect(onLeave).not.toBeCalled();

  act(() => element.dispatchEvent(new Event('mouseleave')));
  expect(result.current).toBeFalsy();
  expect(onEntry).toBeCalledTimes(1);
  expect(onLeave).toBeCalledTimes(1);
});

it('Should change state when entering', () => {
  const element = document.createElement('div');
  const callback = vi.fn();

  const { result } = renderHook(() => useHover(element, callback));

  expect(result.current).toBeFalsy();
  expect(callback).not.toBeCalled();

  act(() => element.dispatchEvent(new Event('mouseenter')));
  expect(result.current).toBeTruthy();
  expect(callback).toBeCalledTimes(1);

  act(() => element.dispatchEvent(new Event('mouseleave')));
  expect(result.current).toBeFalsy();
  expect(callback).toBeCalledTimes(1);
});
