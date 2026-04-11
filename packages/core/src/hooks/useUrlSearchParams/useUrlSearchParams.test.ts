import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { URL_SEARCH_PARAMS_EVENT } from '../useUrlSearchParam/useUrlSearchParam';
import { useUrlSearchParams } from './useUrlSearchParams';

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

it('Should use url search params', () => {
  const { result } = renderHook(useUrlSearchParams);

  expect(result.current.value).toEqual({});
  expect(result.current.set).toBeTypeOf('function');
});

it('Should use url search params on server side', () => {
  const { result } = renderHookServer(useUrlSearchParams);

  expect(result.current.value).toEqual({});
  expect(result.current.set).toBeTypeOf('function');
});

it('Should set initial values and write them to url', () => {
  const { result } = renderHook(() =>
    useUrlSearchParams({ q: 'react', sort: 'relevance', page: 1 })
  );

  expect(result.current.value).toEqual({ q: 'react', sort: 'relevance', page: 1 });
  expect(window.location.search).toBe('?q=react&sort=relevance&page=1');
});

it('Should use existing values over initial values', () => {
  window.history.replaceState({}, '', '/?q=vue&sort=price-desc');
  const { result } = renderHook(() =>
    useUrlSearchParams({ q: 'react', sort: 'relevance', page: 1 })
  );

  expect(result.current.value).toEqual({ q: 'vue', sort: 'price-desc', page: 1 });
  expect(window.location.search).toBe('?q=vue&sort=price-desc&page=1');
});

it('Should set partial values and keep existing values', () => {
  const { result } = renderHook(() =>
    useUrlSearchParams({ q: 'react', sort: 'relevance', page: 1 })
  );

  act(() => result.current.set({ q: 'react hooks' }));

  expect(result.current.value).toEqual({ q: 'react hooks', sort: 'relevance', page: 1 });
  expect(window.location.search).toBe('?q=react+hooks&sort=relevance&page=1');
});

it('Should remove value when it is undefined', () => {
  const { result } = renderHook(() =>
    useUrlSearchParams({ q: 'react', sort: 'relevance', page: 1 })
  );

  act(() => result.current.set({ sort: undefined }));

  expect(result.current.value).toEqual({ q: 'react', page: 1 });
  expect(window.location.search).toBe('?q=react&page=1');
});

it('Should use custom serializer', () => {
  const { result } = renderHook(() =>
    useUrlSearchParams({
      initialValue: { q: 'react' },
      serializer: (value: string) => `search:${value}`
    })
  );

  expect(result.current.value).toEqual({ q: 'react' });
  expect(window.location.search).toBe('?q=search%3Areact');

  act(() => result.current.set({ q: 'hooks' }));

  expect(result.current.value).toEqual({ q: 'search:hooks' });
  expect(window.location.search).toBe('?q=search%3Ahooks');
});

it('Should use custom deserializer', () => {
  window.history.replaceState({}, '', '/?q=search%3Areact');
  const { result } = renderHook(() =>
    useUrlSearchParams({
      deserializer: (value: string) => value.replace('search:', '')
    })
  );

  expect(result.current.value).toEqual({ q: 'react' });
});

it('Should update value when params change externally', () => {
  const { result } = renderHook(() =>
    useUrlSearchParams({
      initialValue: { q: 'react' }
    })
  );

  act(() => {
    window.history.replaceState({}, '', '/?q=svelte');
    window.dispatchEvent(new Event(URL_SEARCH_PARAMS_EVENT));
  });

  expect(result.current.value).toEqual({ q: 'svelte' });
});

it('Should work in hash-params mode', () => {
  const { result } = renderHook(() =>
    useUrlSearchParams({
      initialValue: { q: 'react' },
      mode: 'hash-params'
    })
  );

  expect(result.current.value).toEqual({ q: 'react' });
  expect(window.location.hash).toBe('#q=react');

  act(() => result.current.set({ q: 'hooks' }));

  expect(result.current.value).toEqual({ q: 'hooks' });
  expect(window.location.hash).toBe('#q=hooks');
});

it('Should work in hash mode', () => {
  window.history.replaceState({}, '', '/#section');
  const { result } = renderHook(() =>
    useUrlSearchParams({ initialValue: { q: 'react' }, mode: 'hash' })
  );

  expect(result.current.value).toEqual({ q: 'react' });
  expect(window.location.hash).toBe('#section?q=react');

  act(() => result.current.set({ q: 'hooks' }));

  expect(result.current.value).toEqual({ q: 'hooks' });
  expect(window.location.hash).toBe('#section?q=hooks');
});

it('Should use push write mode', () => {
  const pushStateSpy = vi.spyOn(window.history, 'pushState');
  const { result } = renderHook(() =>
    useUrlSearchParams({ initialValue: { q: 'react' }, write: 'push' })
  );

  act(() => result.current.set({ q: 'hooks' }));

  expect(pushStateSpy).toHaveBeenCalled();
  expect(window.location.search).toBe('?q=hooks');
});

it('Should cleanup on unmount for hash mode', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useUrlSearchParams({ mode: 'hash' }));

  expect(addEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useUrlSearchParams);

  expect(addEventListenerSpy).toHaveBeenCalledWith(URL_SEARCH_PARAMS_EVENT, expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(
    URL_SEARCH_PARAMS_EVENT,
    expect.any(Function)
  );
  expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
});
