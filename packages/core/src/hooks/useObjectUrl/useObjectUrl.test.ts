import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useObjectUrl } from './useObjectUrl';

it('Should use object url', () => {
  const { result } = renderHook(() => useObjectUrl());

  expect(result.current.value).toBeUndefined();
  expect(result.current.revoke).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
});

it('Should use object url on server side', () => {
  const { result } = renderHookServer(() => useObjectUrl());

  expect(result.current.value).toBeUndefined();
  expect(result.current.revoke).toBeTypeOf('function');
  expect(result.current.set).toBeTypeOf('function');
});

it('Should create object url from blob', () => {
  const blob = new Blob(['value'], { type: 'text/plain' });
  const { result } = renderHook(() => useObjectUrl(blob));

  expect(result.current.value).toBeTruthy();
  expect(result.current.value).toMatch(/^blob:/);
});

it('Should revoke object url', () => {
  const blob = new Blob(['value'], { type: 'text/plain' });
  const { result } = renderHook(() => useObjectUrl(blob));

  expect(result.current.value).toBeTruthy();
  expect(result.current.value).toMatch(/^blob:/);

  act(() => result.current.revoke());

  expect(result.current.value).toBeUndefined();
});

it('Should set new blob', () => {
  const { result } = renderHook(() => useObjectUrl());

  expect(result.current.value).toBeUndefined();

  const blob = new Blob(['value'], { type: 'text/plain' });
  act(() => result.current.set(blob));

  expect(result.current.value).toBeTruthy();
  expect(result.current.value).toMatch(/^blob:/);
});
