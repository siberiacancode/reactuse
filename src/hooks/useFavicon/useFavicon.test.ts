import { act, renderHook } from '@testing-library/react';

import { useFavicon } from './useFavicon';

beforeEach(() => {
  document.head.innerHTML = '';
});

it('Should use favicon', () => {
  const { result } = renderHook(useFavicon);

  expect(result.current.href).toBe(undefined);
  expect(typeof result.current.set).toBe('function');
});

it('Should be set initial favicon', () => {
  const { result } = renderHook(() => useFavicon('https://www.google.com/favicon.ico'));
  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
});

it('Should be set the new favicon', () => {
  const { result } = renderHook(useFavicon);

  act(() => result.current.set('https://www.google.com/favicon.ico'));
  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
});

it('Should be set initial favicon and new options.rel ', () => {
  const { result } = renderHook(() =>
    useFavicon('https://www.google.com/favicon.ico', { rel: 'shortcut icon' })
  );

  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
  expect(document.querySelector<HTMLLinkElement>(`link[href="${result.current.href}"]`)?.rel).toBe(
    'shortcut icon'
  );
});
