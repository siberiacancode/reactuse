import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { URL_SEARCH_PARAMS_EVENT, useUrlSearchParam } from './useUrlSearchParam';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

it('Should use url search param', () => {
  const { result } = renderHook(() => useUrlSearchParam('q'));

  expect(result.current.value).toBeUndefined();
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should use url search param on server side', () => {
  const { result } = renderHookServer(() => useUrlSearchParam('q'));

  expect(result.current.value).toBeUndefined();
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should set initial value when search param is missing', () => {
  const { result } = renderHook(() => useUrlSearchParam('q', 'react'));

  expect(result.current.value).toBe('react');
  expect(window.location.search).toBe('?q=react');
});

it('Should use existing search param value over initial value', () => {
  window.history.replaceState({}, '', '/?q=vue');
  const { result } = renderHook(() => useUrlSearchParam('q', 'react'));

  expect(result.current.value).toBe('vue');
  expect(window.location.search).toBe('?q=vue');
});

it('Should set and remove value', () => {
  window.history.replaceState({}, '', '/?keep=1');
  const { result } = renderHook(() => useUrlSearchParam('q'));

  act(() => result.current.set('react'));

  expect(result.current.value).toBe('react');
  expect(window.location.search).toBe('?keep=1&q=react');

  act(result.current.remove);

  expect(result.current.value).toBeUndefined();
  expect(window.location.search).toBe('?keep=1');
});

it('Should use custom serializer', () => {
  const { result } = renderHook(() =>
    useUrlSearchParam('q', {
      initialValue: 'react',
      serializer: (value: string) => `search:${value}`
    })
  );

  expect(result.current.value).toBe('react');
  expect(window.location.search).toBe('?q=search%3Areact');

  act(() => result.current.set('hooks'));

  expect(result.current.value).toBe('hooks');
  expect(window.location.search).toBe('?q=search%3Ahooks');
});

it('Should use custom deserializer', () => {
  window.history.replaceState({}, '', '/?q=search%3Areact');
  const { result } = renderHook(() =>
    useUrlSearchParam('q', {
      deserializer: (value: string) => value.replace('search:', '')
    })
  );

  expect(result.current.value).toBe('react');
});

it('Should update value when search param changes externally', () => {
  const { result } = renderHook(() => useUrlSearchParam('q'));

  act(() => {
    window.history.replaceState({}, '', '/?q=svelte');
    window.dispatchEvent(new Event(URL_SEARCH_PARAMS_EVENT));
  });

  expect(result.current.value).toBe('svelte');
});

it('Should work in hash-params mode', () => {
  const { result } = renderHook(() =>
    useUrlSearchParam('q', {
      initialValue: 'react',
      mode: 'hash-params'
    })
  );

  expect(result.current.value).toBe('react');
  expect(window.location.hash).toBe('#q=react');

  act(() => result.current.set('hooks'));

  expect(result.current.value).toBe('hooks');
  expect(window.location.hash).toBe('#q=hooks');
});

it('Should work in hash mode', () => {
  window.history.replaceState({}, '', '/#section');
  const { result } = renderHook(() =>
    useUrlSearchParam('q', {
      initialValue: 'react',
      mode: 'hash'
    })
  );

  expect(result.current.value).toBe('react');
  expect(window.location.hash).toBe('#section?q=react');

  act(() => result.current.set('hooks'));

  expect(result.current.value).toBe('hooks');
  expect(window.location.hash).toBe('#section?q=hooks');
});

it('Should use push write mode', () => {
  const pushStateSpy = vi.spyOn(window.history, 'pushState');
  const { result } = renderHook(() =>
    useUrlSearchParam('q', {
      write: 'push'
    })
  );

  act(() => result.current.set('react'));

  expect(pushStateSpy).toHaveBeenCalled();
  expect(window.location.search).toBe('?q=react');
});

it('Should cleanup on unmount for hash mode', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() =>
    useUrlSearchParam('q', {
      mode: 'hash'
    })
  );

  expect(addEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useUrlSearchParam('q'));

  expect(addEventListenerSpy).toHaveBeenCalledWith(URL_SEARCH_PARAMS_EVENT, expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    URL_SEARCH_PARAMS_EVENT,
    expect.any(Function)
  );
  expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
});
