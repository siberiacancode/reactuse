import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useHash } from './useHash';

beforeEach(() => {
  window.location.hash = '';
});

it('Should use hash', () => {
  const { result } = renderHook(useHash);

  expect(result.current.value).toBe('');
  expect(result.current.set).toBeTypeOf('function');
});

it('Should set hash', () => {
  const { result } = renderHook(useHash);

  act(() => result.current.set('test'));

  expect(window.location.hash).toBe('#test');
  expect(result.current.value).toBe('test');
});

it('Should set hash on server side', () => {
  const { result } = renderHookServer(useHash);

  expect(result.current.value).toBe('');
});

it('Should use initial value on server side', () => {
  const { result } = renderHookServer(() => useHash('initial'));

  expect(result.current.value).toBe('initial');
});

it('Should handle hash change', () => {
  const { result } = renderHook(useHash);

  act(() => {
    window.location.hash = '#external';
    window.dispatchEvent(new Event('hashchange'));
  });

  expect(result.current.value).toBe('external');
});

it('Should decode hash', () => {
  const { result } = renderHook(useHash);

  act(() => result.current.set('testvalue'));

  expect(window.location.hash).toBe('#testvalue');
  expect(result.current.value).toBe('testvalue');
});

it('Should use initial value', () => {
  const { result } = renderHook(() => useHash('initial'));

  expect(window.location.hash).toBe('#initial');
  expect(result.current.value).toBe('initial');
});

it('Should prefer existing hash over initial value', () => {
  window.location.hash = '#existing';

  const { result } = renderHook(() => useHash('initial', { mode: 'initial' }));

  expect(window.location.hash).toBe('#existing');
  expect(result.current.value).toBe('existing');
});

it('Should call onChange callback when hash changes programmatically', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useHash('initial', callback));

  act(() => result.current.set('testvalue'));

  expect(callback).toHaveBeenCalledWith('testvalue');
  expect(callback).toHaveBeenCalledTimes(1);
});

it('Should call onChange callback when hash changes externally', () => {
  const callback = vi.fn();
  renderHook(() => useHash('initial', callback));

  act(() => {
    window.location.hash = '#external-hash';
    window.dispatchEvent(new Event('hashchange'));
  });

  expect(callback).toHaveBeenCalledWith('external-hash');
});

it('Should work with options object', () => {
  const onChange = vi.fn();
  const { result } = renderHook(() =>
    useHash('initial', {
      onChange
    })
  );

  expect(result.current.value).toBe('initial');

  act(() => result.current.set('testvalue'));

  expect(onChange).toHaveBeenCalledWith('testvalue');
  expect(result.current.value).toBe('testvalue');
});

it('Should not work when disabled', () => {
  const { result } = renderHook(() =>
    useHash('initial', {
      enabled: false
    })
  );

  expect(result.current.value).toBe('initial');

  act(() => {
    window.location.hash = '#external-hash';
    window.dispatchEvent(new Event('hashchange'));
  });

  expect(result.current.value).toBe('initial');
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useHash);

  expect(addEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
});
