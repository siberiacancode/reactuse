import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { dispatchStorageEvent, STORAGE_EVENT, useStorage } from './useStorage';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

it('Should use storage', () => {
  const { result } = renderHook(() => useStorage('key', 'initialValue'));

  expect(result.current.value).toBe('initialValue');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should use storage on server side', () => {
  const { result } = renderHookServer(() => useStorage('key', 'initialValue'));

  expect(result.current.value).toBe('initialValue');
  expect(result.current.set).toBeTypeOf('function');
  expect(result.current.remove).toBeTypeOf('function');
});

it('Should return undefined value when initial value is not passed', () => {
  const { result } = renderHook(() => useStorage('key'));

  expect(result.current.value).toBeUndefined();
});

it('Should set initial value from factory function', () => {
  const initialValue = vi.fn(() => 'initialValue');
  const { result } = renderHook(() => useStorage('key', initialValue));

  expect(initialValue).toHaveBeenCalledTimes(1);
  expect(result.current.value).toBe('initialValue');
  expect(window.localStorage.getItem('key')).toBe('initialValue');
});

it('Should use object value as initial value', () => {
  const objectValue = { name: 'Dima', age: 25 };
  const { result } = renderHook(() => useStorage('key', objectValue));

  expect(result.current.value).toEqual(objectValue);
  expect(window.localStorage.getItem('key')).toBe(JSON.stringify(objectValue));
});

it('Should use existing storage value over initial value', () => {
  window.localStorage.setItem('key', 'storedValue');

  const { result } = renderHook(() => useStorage('key', 'initialValue'));

  expect(result.current.value).toBe('storedValue');
});

it('Should set value into storage', () => {
  const { result } = renderHook(() => useStorage('key', 'initialValue'));

  act(() => result.current.set('newValue'));

  expect(result.current.value).toBe('newValue');
  expect(window.localStorage.getItem('key')).toBe('newValue');
});

it('Should remove value from storage', () => {
  const { result } = renderHook(() => useStorage('key', 'initialValue'));

  act(result.current.remove);

  expect(result.current.value).toBeUndefined();
  expect(window.localStorage.getItem('key')).toBeNull();
});

it('Should use options initial value', () => {
  const { result } = renderHook(() =>
    useStorage('key', {
      initialValue: 'initialValue'
    })
  );

  expect(result.current.value).toBe('initialValue');
  expect(window.localStorage.getItem('key')).toBe('initialValue');
});

it('Should use custom storage', () => {
  const { result } = renderHook(() =>
    useStorage('key', {
      initialValue: 'initialValue',
      storage: window.sessionStorage
    })
  );

  act(() => result.current.set('newValue'));

  expect(result.current.value).toBe('newValue');
  expect(window.localStorage.getItem('key')).toBeNull();
  expect(window.sessionStorage.getItem('key')).toBe('newValue');
});

it('Should use custom serializer', () => {
  const { result } = renderHook(() =>
    useStorage('key', {
      initialValue: 'initialValue',
      serializer: (value: string) => `custom-${value}`
    })
  );

  act(() => result.current.set('newValue'));

  expect(result.current.value).toBe('custom-newValue');
  expect(window.localStorage.getItem('key')).toBe('custom-newValue');
});

it('Should use custom deserializer', () => {
  window.localStorage.setItem('key', 'custom-value');

  const { result } = renderHook(() =>
    useStorage('key', {
      deserializer: (value) => value.replace('custom-', '')
    })
  );

  expect(result.current.value).toBe('value');
});

it('Should deserialize undefined string to undefined', () => {
  window.localStorage.setItem('key', 'undefined');

  const { result } = renderHook(() => useStorage('key'));

  expect(result.current.value).toBeUndefined();
});

it('Should update value on custom storage event', () => {
  const { result } = renderHook(() => useStorage('key', 'initialValue'));

  act(() => {
    window.localStorage.setItem('key', 'externalValue');
    dispatchStorageEvent({
      key: 'key',
      oldValue: 'initialValue',
      newValue: 'externalValue',
      storageArea: window.localStorage
    });
  });

  expect(result.current.value).toBe('externalValue');
});

it('Should not update value on custom storage event for another key', () => {
  const { result } = renderHook(() => useStorage('key', 'initialValue'));

  act(() => {
    window.localStorage.setItem('another-key', 'externalValue');
    dispatchStorageEvent({
      key: 'another-key',
      oldValue: null,
      newValue: 'externalValue',
      storageArea: window.localStorage
    });
  });

  expect(result.current.value).toBe('initialValue');
});

it('Should subscribe to storage events and cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => useStorage('key', 'initialValue'));

  expect(addEventListenerSpy).toHaveBeenCalledWith(STORAGE_EVENT, expect.any(Function));
  expect(addEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function), {
    passive: true
  });

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith(STORAGE_EVENT, expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
});
