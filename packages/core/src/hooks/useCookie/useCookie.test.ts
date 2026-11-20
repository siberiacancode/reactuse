import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { clearCookies } from '../useCookies/useCookies';
import { COOKIE_EVENT, removeCookie, setCookie, useCookie } from './useCookie';

beforeEach(() => clearCookies());

it('Should use cookie', () => {
  const { result } = renderHook(() => useCookie('cookie'));

  expect(COOKIE_EVENT).toBe('reactuse-cookie');
  expect(result.current.value).toBeUndefined();
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should use cookie on server side', () => {
  const { result } = renderHookServer(() => useCookie('cookie'));

  expect(result.current.value).toBeUndefined();
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should set initial value', () => {
  const { result } = renderHook(() => useCookie('cookie', 'value'));
  expect(result.current.value).toBe('value');
});

it('Should set lazy initial value', () => {
  const initialValue = vi.fn(() => 'value');
  const { result } = renderHook(() => useCookie('cookie', initialValue));

  expect(result.current.value).toBe('value');
  expect(initialValue).toHaveBeenCalledOnce();
  expect(document.cookie).toContain('cookie=value');
});

it('Should set cookie value', () => {
  const { result } = renderHook(() => useCookie('cookie'));
  const mockDocumentCookie = vi.spyOn(Document.prototype, 'cookie', 'set');

  expect(result.current.value).toBeUndefined();

  act(() => result.current.set('value'));

  expect(result.current.value).toBe('value');
  expect(document.cookie).toContain('cookie=value');
  expect(mockDocumentCookie).toHaveBeenCalledWith('cookie=value');
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

it('Should serialize cookie attributes', () => {
  const mockDocumentCookie = vi.spyOn(Document.prototype, 'cookie', 'set');
  const expires = new Date('2030-01-01T00:00:00.000Z');

  setCookie('cookie key', 'value=', {
    domain: 'localhost',
    expires,
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'None',
    secure: true
  });

  expect(mockDocumentCookie).toHaveBeenCalledWith(
    `cookie%20key=value%3D; path=/; domain=localhost; max-age=0; expires=${expires.toUTCString()}; secure; httpOnly; samesite=None`
  );
});

it('Should remove cookie', () => {
  const { result } = renderHook(() => useCookie('cookie', 'value'));
  const mockDocumentCookie = vi.spyOn(Document.prototype, 'cookie', 'set');

  act(() => result.current.remove());

  expect(result.current.value).toBeUndefined();
  expect(document.cookie).not.toContain('cookie');
  expect(mockDocumentCookie).toHaveBeenCalledWith('cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT');
});

it('Should serialize attributes when removing cookie', () => {
  const mockDocumentCookie = vi.spyOn(Document.prototype, 'cookie', 'set');

  removeCookie('cookie key', {
    domain: 'localhost',
    expires: new Date('2030-01-01T00:00:00.000Z'),
    maxAge: 10,
    path: '/',
    sameSite: 'Strict',
    secure: true
  });

  expect(mockDocumentCookie).toHaveBeenCalledWith(
    'cookie%20key=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=Strict'
  );
});

it('Should deserialize undefined cookie value', () => {
  const { result } = renderHook(() => useCookie<string | undefined>('cookie'));

  act(() => result.current.set(undefined));

  expect(result.current.value).toBeUndefined();
  expect(document.cookie).toContain('cookie=undefined');
});

it('Should preserve equals signs in cookie value', () => {
  document.cookie = 'cookie=value=with=equals';

  const { result } = renderHook(() => useCookie('cookie'));

  expect(result.current.value).toBe('value=with=equals');
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
