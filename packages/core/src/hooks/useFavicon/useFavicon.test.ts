import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useFavicon } from './useFavicon';

beforeEach(() => {
  const favicon = document.querySelector("link[rel*='icon']");
  if (favicon) favicon.remove();
});

it('Should use favicon', () => {
  const { result } = renderHook(useFavicon);

  expect(result.current.href).toBe(undefined);
  expect(result.current.set).toBeTypeOf('function');
});

it('Should use favicon on server side', () => {
  const { result } = renderHookServer(useFavicon);

  expect(result.current.href).toBe(undefined);
  expect(result.current.set).toBeTypeOf('function');
});

it('Should set initial favicon', () => {
  const { result } = renderHook(() =>
    useFavicon('https://siberiacancode.github.io/reactuse/favicon.ico')
  );

  const favicon = document.querySelector("link[rel*='icon']");
  expect(favicon).toBeInstanceOf(HTMLLinkElement);
  expect(result.current.href).toBe('https://siberiacancode.github.io/reactuse/favicon.ico');
});

it('Should apply existing favicon', () => {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = 'https://siberiacancode.github.io/reactuse/favicon.ico';
  link.type = 'image/ico';
  document.head.appendChild(link);

  const { result } = renderHook(useFavicon);

  expect(result.current.href).toBe('https://siberiacancode.github.io/reactuse/favicon.ico');
});

it('Should set the new favicon', () => {
  const { result } = renderHook(useFavicon);

  act(() => result.current.set('https://siberiacancode.github.io/reactuse/favicon.ico'));

  const favicon = document.querySelector("link[rel*='icon']");
  expect(favicon).toBeInstanceOf(HTMLLinkElement);
  expect(result.current.href).toBe('https://siberiacancode.github.io/reactuse/favicon.ico');
});
