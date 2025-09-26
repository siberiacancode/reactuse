import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useHash } from './useHash';

beforeEach(() => {
  window.location.hash = '';
});

it('Should use hash', () => {
  const { result } = renderHook(useHash);

  const [hash, setHash] = result.current;

  expect(hash).toBe('');
  expect(setHash).toBeTypeOf('function');
});

it('Should set hash', () => {
  const { result } = renderHook(useHash);

  const [_, set] = result.current;

  act(() => set('test'));

  expect(window.location.hash).toBe('#test');
  expect(result.current[0]).toBe('test');
});

it('Should set hash on server side', () => {
  const { result } = renderHookServer(useHash);

  expect(result.current[0]).toBe('');
});

it('Should use initial value on server side', () => {
  const { result } = renderHookServer(() => useHash('initial'));

  expect(result.current[0]).toBe('initial');
});

it('Should handle hash change', () => {
  const { result } = renderHook(useHash);

  act(() => {
    window.location.hash = '#external';
    window.dispatchEvent(new Event('hashchange'));
  });

  expect(result.current[0]).toBe('external');
});

it('Should decode hash', () => {
  const { result } = renderHook(useHash);

  const [_, set] = result.current;

  act(() => set('testvalue'));

  expect(window.location.hash).toBe('#testvalue');
  expect(result.current[0]).toBe('testvalue');
});

it('Should use initial value', () => {
  const { result } = renderHook(() => useHash('initial'));

  expect(window.location.hash).toBe('#initial');
  expect(result.current[0]).toBe('initial');
});

it('Should prefer existing hash over initial value', () => {
  window.location.hash = '#existing';

  const { result } = renderHook(() => useHash('initial', { mode: 'initial' }));

  expect(window.location.hash).toBe('#existing');
  expect(result.current[0]).toBe('existing');
});

it('Should call onChange callback when hash changes programmatically', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useHash('initial', callback));

  const [_, set] = result.current;

  act(() => set('testvalue'));

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

  const [_, set] = result.current;

  expect(result.current[0]).toBe('initial');

  act(() => set('testvalue'));

  expect(onChange).toHaveBeenCalledWith('testvalue');
  expect(result.current[0]).toBe('testvalue');
});

it('Should not work when disabled', () => {
  const { result } = renderHook(() =>
    useHash('initial', {
      enabled: false
    })
  );

  expect(result.current[0]).toBe('initial');

  act(() => {
    window.location.hash = '#external-hash';
    window.dispatchEvent(new Event('hashchange'));
  });

  expect(result.current[0]).toBe('initial');
});

it('Should clean up on unmount', () => {
  const { unmount } = renderHook(useHash);
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('hashchange', expect.any(Function));
});
