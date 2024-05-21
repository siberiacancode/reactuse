import { act, renderHook, waitFor } from '@testing-library/react';

import { useDocumentTitle } from './useDocumentTitle';

beforeEach(() => {
  document.title = 'default title';
});

it('Should use document title', () => {
  const { result } = renderHook(useDocumentTitle);
  const [title, setTitle] = result.current;

  expect(title).toBe('default title');
  expect(typeof setTitle).toBe('function');
});

it('Should be set initial title', () => {
  const { result } = renderHook(() => useDocumentTitle('title'));

  waitFor(() => expect(result.current[0]).toBe('title'));
});

it('Should be set new title', () => {
  const { result } = renderHook(useDocumentTitle);

  act(() => result.current[1]('new title'));
  waitFor(() => expect(result.current[0]).toBe('new title'));
});

it('Should be restore initial title when unmount', () => {
  const { result, unmount } = renderHook(() =>
    useDocumentTitle('title', { restoreOnUnmount: true })
  );

  act(() => result.current[1]('new title'));
  waitFor(() => expect(result.current[0]).toBe('new title'));

  unmount();
  waitFor(() => expect(result.current[0]).toBe('title'));
});
