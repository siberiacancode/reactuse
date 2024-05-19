import { act, renderHook, waitFor } from '@testing-library/react';

import { useDocumentTitle } from './useDocumentTitle';

afterEach(() => {
  document.title = '';
});

it('Should be defined useDocumentTitle', () => {
  const { result } = renderHook(useDocumentTitle);

  expect(result.current[0]).toBe('');
  expect(typeof result.current[1]).toBe('function');
});

it('Should be set initial title', () => {
  const { result } = renderHook(() => useDocumentTitle('title'));

  waitFor(() => expect(result.current[0]).toBe('title'));
});

it('Should be set new title', () => {
  const { result } = renderHook(() => useDocumentTitle());

  act(() => result.current[1]('new title'));
  waitFor(() => expect(result.current[0]).toBe('new title'));
});

it('Should be restore initial title', () => {
  const { result, unmount } = renderHook(() =>
    useDocumentTitle('title', { restoreOnUnmount: true })
  );

  act(() => result.current[1]('new title'));
  waitFor(() => expect(result.current[0]).toBe('new title'));

  unmount();
  waitFor(() => expect(result.current[0]).toBe('title'));
});
