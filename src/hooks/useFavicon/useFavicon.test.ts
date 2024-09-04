import { act, renderHook } from '@testing-library/react';

import { useFavicon } from './useFavicon';

afterEach(() => {
  const favicon = document.querySelector("link[rel*='icon']");
  if (favicon) favicon.remove();
});

it('Should use favicon', () => {
  const { result } = renderHook(useFavicon);

  expect(result.current.href).toBe(undefined);
  expect(typeof result.current.set).toBe('function');
});

it('Should be set initial favicon', () => {
  const { result } = renderHook(() => useFavicon('https://www.google.com/favicon.ico'));

  const favicon = document.querySelector("link[rel*='icon']");
  expect(favicon).toBeInstanceOf(HTMLLinkElement);
  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
});

it('Should set existing favicon', () => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'https://www.google.com/favicon.ico';
  link.type = 'image/ico';
  document.head.appendChild(link);

  const { result } = renderHook(() => useFavicon());

  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
});

it('Should be set the new favicon', () => {
  const { result } = renderHook(useFavicon);

  act(() => result.current.set('https://www.google.com/favicon.ico'));

  const favicon = document.querySelector("link[rel*='icon']");
  expect(favicon).toBeInstanceOf(HTMLLinkElement);
  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
});

it('Should update the favicon when the href changes', () => {
  const { result, rerender } = renderHook((state) => useFavicon(state), {
    initialProps: 'https://www.google.com/favicon.ico'
  });

  expect(result.current.href).toBe('https://www.google.com/favicon.ico');
  rerender('https://react.dev/favicon-32x32.png');
  expect(result.current.href).toBe('https://react.dev/favicon-32x32.png');
});
