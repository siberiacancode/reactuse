import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useHash } from './useHash';

beforeEach(() => {
  window.location.hash = '';
});

it('Should use hash', () => {
  const { result } = renderHook(useHash);

  const [hash, setHash] = result.current;

  expect(hash).toBe('');
  expect(setHash).toBeTypeOf('function');
});

it('Should set hash', () => {
  const { result } = renderHook(useHash);

  const [_, set] = result.current;

  act(() => set('test'));

  expect(window.location.hash).toBe('#test');
  expect(result.current[0]).toBe('test');
});

it('Should set hash on server side', () => {
  const { result } = renderHookServer(useHash);

  expect(result.current[0]).toBe('');
});

it('Should use initial value on server side', () => {
  const { result } = renderHookServer(() => useHash('initial'));

  expect(result.current[0]).toBe('initial');
});

it('Should handle hash change', () => {
  const { result } = renderHook(useHash);

  act(() => {
    window.location.hash = '#external';
    window.dispatchEvent(new Event('hashchange'));
  });

  expect(result.current[0]).toBe('external');
});

it('Should decode hash', () => {
  const { result } = renderHook(useHash);

  const [_, set] = result.current;

  act(() => set('test value'));

  expect(window.location.hash).toBe('#test%20value');
  expect(result.current[0]).toBe('test value');
});

it('Should use initial value', () => {
  const { result } = renderHook(() => useHash('initial'));

  expect(window.location.hash).toBe('#initial');
  expect(result.current[0]).toBe('initial');
});

it('Should prefer existing hash over initial value', () => {
  window.location.hash = '#existing';

  const { result } = renderHook(() => useHash('initial', 'initial'));

  expect(window.location.hash).toBe('#existing');
  expect(result.current[0]).toBe('existing');
});
