import { act, renderHook, waitFor } from '@testing-library/react';

import { useDocumentTitle } from './useDocumentTitle';

beforeEach(() => {
  document.title = 'default title';
});

it('Should use document title', () => {
  const { result } = renderHook(useDocumentTitle);
  const { value, set } = result.current;

  expect(value).toBe('default title');
  expect(set).toBeTypeOf('function');
});

it('Should be set initial title', () => {
  const { result } = renderHook(() => useDocumentTitle('title'));

  waitFor(() => expect(result.current.value).toBe('title'));
});

it('Should be set new title', () => {
  const { result } = renderHook(useDocumentTitle);

  act(() => result.current.set('new title'));
  waitFor(() => expect(result.current.value).toBe('new title'));
});

it('Should be restore initial title when unmount', () => {
  const { result, unmount } = renderHook(() =>
    useDocumentTitle('title', { restoreOnUnmount: true })
  );

  act(() => result.current.set('new title'));
  waitFor(() => expect(result.current.value).toBe('new title'));

  unmount();
  waitFor(() => expect(result.current.value).toBe('title'));
});
