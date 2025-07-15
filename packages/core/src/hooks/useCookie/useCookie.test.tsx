import { act, renderHook } from '@testing-library/react';

import { clearCookies } from '../useCookies/useCookies';
import { COOKIE_EVENT, useCookie } from './useCookie';

beforeEach(() => clearCookies());

it('Should use cookie', () => {
  const { result } = renderHook(() => useCookie('cookie'));

  expect(result.current.value).toBeUndefined();
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useCookie('cookie', 'value'));
  expect(result.current.value).toBe('value');
});

it('Should set cookie value', () => {
  const { result } = renderHook(() => useCookie('cookie'));

  expect(result.current.value).toBeUndefined();

  act(() => result.current.set('value'));

  expect(result.current.value).toBe('value');
  expect(document.cookie).toContain('cookie=value');
});

it('Should set cookie value with options', () => {
  const { result } = renderHook(() => useCookie('cookie'));

  expect(result.current.value).toBeUndefined();

  act(() =>
    result.current.set('value', {
      domain: 'localhost',
      path: '/',
      sameSite: 'Strict',
      maxAge: 10
    })
  );

  expect(result.current.value).toBe('value');
  expect(document.cookie).toContain('cookie=value');
});

it('Should remove cookie', () => {
  const { result } = renderHook(() => useCookie('cookie', 'value'));

  act(() => result.current.remove());

  expect(result.current.value).toBeUndefined();
  expect(document.cookie).not.toContain('cookie');
});

it('Should handle object values', () => {
  const value = {
    number: 1,
    string: 'test',
    boolean: true,
    null: null,
    undefined
  };
  const { result } = renderHook(() => useCookie('test-cookie', value));

  expect(result.current.value).toEqual(value);

  act(() =>
    result.current.set({
      number: 2,
      string: 'updated',
      boolean: false,
      null: null,
      undefined
    })
  );

  expect(result.current.value).toEqual({
    number: 2,
    string: 'updated',
    boolean: false,
    null: null,
    undefined
  });
});

it('Should use custom serializer', () => {
  const serializer = (value: string) => `string-${value}`;

  const { result } = renderHook(() =>
    useCookie('cookie', {
      initialValue: 'value',
      serializer
    })
  );

  expect(result.current.value).toBe('value');

  act(() => result.current.set('new-value'));

  expect(result.current.value).toBe('string-new-value');
  expect(document.cookie).toContain('cookie=string-new-value');
});

it('Should use custom deserializer', () => {
  document.cookie = 'cookie=string-value';
  const deserializer = (value: string) => value.replace('string-', '');

  const { result } = renderHook(() =>
    useCookie('cookie', {
      deserializer
    })
  );

  expect(result.current.value).toBe('value');
});

it('Should update value when cookie changes externally', () => {
  document.cookie = 'cookie=value';
  const { result } = renderHook(() => useCookie('cookie'));

  expect(result.current.value).toBe('value');

  act(() => {
    document.cookie = 'cookie=external-value';
    window.dispatchEvent(new Event(COOKIE_EVENT));
  });

  expect(result.current.value).toBe('external-value');
});

it('Should handle key changes', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { rerender } = renderHook((key) => useCookie(key), {
    initialProps: 'value'
  });

  expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
  expect(removeEventListenerSpy).not.toHaveBeenCalled();

  rerender('new-value');

  expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
  expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useCookie('cookie'));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(COOKIE_EVENT, expect.any(Function));
});
