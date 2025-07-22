import { act, renderHook } from '@testing-library/react';

import { COOKIE_EVENT } from '../useCookie/useCookie';
import { clearCookies, useCookies } from './useCookies';

beforeEach(() => clearCookies());

it('Should use cookies', () => {
  const { result } = renderHook(() => useCookies());

  expect(result.current.value).toEqual({});
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
  expect(result.current.getAll).toBeTypeOf('function');
  expect(result.current.clear).toBeTypeOf('function');
});

it('Should set cookie', () => {
  const { result } = renderHook(() => useCookies<{ cookie: string }>());

  act(() => result.current.set('cookie', 'value'));

  expect(document.cookie).toContain('cookie=value');
});

it('Should get cookie', () => {
  document.cookie = 'cookie=value';
  const { result } = renderHook(() => useCookies<{ cookie: string }>());

  expect(result.current.value).toEqual({ cookie: 'value' });
});

it('Should remove cookie', () => {
  document.cookie = 'cookie=value';
  const { result } = renderHook(() => useCookies<{ cookie: string }>());

  expect(result.current.value).toEqual({ cookie: 'value' });

  act(() => result.current.remove('cookie'));

  expect(result.current.value).toEqual({});
});

it('Should clear all cookies', () => {
  document.cookie = 'cookie=value';
  const { result } = renderHook(() => useCookies<{ cookie: string }>());

  expect(result.current.value).toEqual({ cookie: 'value' });

  act(() => result.current.clear());

  expect(result.current.value).toEqual({});
});

it('Should handle object values', () => {
  const { result } = renderHook(() => useCookies<{ test: { name: string; age: number } }>());

  const testValue = { name: 'John', age: 30 };

  act(() => {
    result.current.set('test', testValue);
  });

  expect(result.current.value).toEqual({ test: testValue });
});

it('Should use custom serializer', () => {
  const serializer = (value: string) => `string-${value}`;

  const { result } = renderHook(() =>
    useCookies<{ cookie: string }>({
      serializer
    })
  );

  act(() => result.current.set('cookie', 'value'));

  expect(result.current.value).toEqual({ cookie: 'string-value' });
  expect(document.cookie).toContain('cookie=string-value');
});

it('Should use custom deserializer', () => {
  document.cookie = 'cookie=string-value';
  const deserializer = (value: string) => value.replace('string-', '');

  const { result } = renderHook(() =>
    useCookies<{ cookie: string }>({
      deserializer
    })
  );

  expect(result.current.value).toEqual({ cookie: 'value' });
});

it('Should handle cookie changes from external sources', () => {
  document.cookie = 'cookie=value';
  const { result } = renderHook(() => useCookies<{ cookie: string }>());

  expect(result.current.value).toEqual({ cookie: 'value' });

  act(() => {
    document.cookie = 'cookie=external-value';
    window.dispatchEvent(new Event(COOKIE_EVENT));
  });

  expect(result.current.value).toEqual({ cookie: 'external-value' });
});

it('Should get all cookies', () => {
  document.cookie = 'cookie=value';
  const { result } = renderHook(() => useCookies<{ cookie: string }>());

  expect(result.current.getAll()).toEqual({ cookie: 'value' });
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useCookies());

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(COOKIE_EVENT, expect.any(Function));
});
