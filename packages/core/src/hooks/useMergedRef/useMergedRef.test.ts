import { renderHook } from '@testing-library/react';
import { createRef } from 'react';

import { renderHookServer } from '@/tests';

import { useMergedRef } from './useMergedRef';

const target = document.createElement('div');

it('Should use merged ref', () => {
  const { result } = renderHook(() => useMergedRef());

  expect(result.current).toBeTypeOf('function');
});

it('Should use merged ref on server side', () => {
  const { result } = renderHookServer(() => useMergedRef());

  expect(result.current).toBeTypeOf('function');
});

it('Should merge mixed refs', () => {
  const firstRef = createRef<HTMLDivElement>();
  const secondRef = vi.fn();

  const { result } = renderHook(() => useMergedRef(firstRef, secondRef));

  result.current(target);

  expect(firstRef.current).toBe(target);
  expect(secondRef).toHaveBeenCalledWith(target);
});

it('Should handle cleanup function', () => {
  const cleanup = vi.fn();
  const ref = vi.fn(() => cleanup);

  const { result } = renderHook(() => useMergedRef(ref));

  const cleanupAll = result.current(target)!;

  expect(ref).toHaveBeenCalledWith(target);

  cleanupAll();

  expect(cleanup).toHaveBeenCalled();
});
