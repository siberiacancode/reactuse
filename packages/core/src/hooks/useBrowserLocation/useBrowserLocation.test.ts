import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useBrowserLocation } from './useBrowserLocation';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

it('Should use browser location', () => {
  const { result } = renderHook(useBrowserLocation);

  expect(result.current.value).toMatchObject({
    hash: window.location.hash,
    host: window.location.host,
    hostname: window.location.hostname,
    href: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    port: window.location.port,
    protocol: window.location.protocol,
    search: window.location.search,
    length: window.history.length,
    state: window.history.state,
    searchParams: new URLSearchParams()
  });
  expect(result.current.push).toBeTypeOf('function');
  expect(result.current.replace).toBeTypeOf('function');
  expect(result.current.back).toBeTypeOf('function');
  expect(result.current.forward).toBeTypeOf('function');
  expect(result.current.go).toBeTypeOf('function');
});

it('Should use browser location on server side', () => {
  const { result } = renderHookServer(useBrowserLocation);

  expect(result.current.value).toMatchObject({
    searchParams: new URLSearchParams()
  });
  expect(result.current.push).toBeTypeOf('function');
  expect(result.current.replace).toBeTypeOf('function');
  expect(result.current.back).toBeTypeOf('function');
  expect(result.current.forward).toBeTypeOf('function');
  expect(result.current.go).toBeTypeOf('function');
});

it('Should navigate with push', () => {
  const pushStateSpy = vi.spyOn(window.history, 'pushState');
  const { result } = renderHook(useBrowserLocation);

  act(() =>
    result.current.push('/browser-location?tab=push#section', { page: 'push' }, 'push-title')
  );

  expect(pushStateSpy).toHaveBeenCalledWith(
    { page: 'push' },
    'push-title',
    '/browser-location?tab=push#section'
  );
  expect(result.current.value.pathname).toBe('/browser-location');
  expect(result.current.value.search).toBe('?tab=push');
  expect(result.current.value.hash).toBe('#section');
  expect(result.current.value.state).toEqual({ page: 'push' });
});

it('Should navigate with replace', () => {
  const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
  const { result } = renderHook(useBrowserLocation);

  act(() =>
    result.current.replace(
      '/browser-location?tab=replace#state',
      { page: 'replace' },
      'replace-title'
    )
  );

  expect(replaceStateSpy).toHaveBeenCalledWith(
    { page: 'replace' },
    'replace-title',
    '/browser-location?tab=replace#state'
  );
  expect(result.current.value.pathname).toBe('/browser-location');
  expect(result.current.value.search).toBe('?tab=replace');
  expect(result.current.value.hash).toBe('#state');
  expect(result.current.value.state).toEqual({ page: 'replace' });
});

it('Should navigate with back', () => {
  const backSpy = vi.spyOn(window.history, 'back');
  const { result } = renderHook(useBrowserLocation);

  act(() => result.current.back());

  expect(backSpy).toHaveBeenCalledTimes(1);
});

it('Should navigate with forward', () => {
  const forwardSpy = vi.spyOn(window.history, 'forward');
  const { result } = renderHook(useBrowserLocation);

  act(() => result.current.forward());

  expect(forwardSpy).toHaveBeenCalledTimes(1);
});

it('Should navigate with go', () => {
  const goSpy = vi.spyOn(window.history, 'go');
  const { result } = renderHook(useBrowserLocation);

  act(() => result.current.go(-1));

  expect(goSpy).toHaveBeenCalledWith(-1);
});

it('Should update state on popstate', () => {
  const { result } = renderHook(useBrowserLocation);

  act(() => {
    window.history.pushState({ page: 'external' }, '', '/external');
    window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
  });

  expect(result.current.value.pathname).toBe('/external');
  expect(result.current.value.state).toEqual({ page: 'external' });
});

it('Should update state on hashchange', () => {
  const { result } = renderHook(useBrowserLocation);

  act(() => {
    window.location.hash = '#external';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  expect(result.current.value.hash).toBe('#external');
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useBrowserLocation);

  expect(addEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
});
