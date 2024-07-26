import { act, renderHook } from '@testing-library/react';

import { useScript } from './useScript';

const src = 'script.js';

afterEach(() => {
  const script = document.querySelector(`script[src="${src}"]`);
  if (script) script.remove();
});

it('Should use script', () => {
  const { result } = renderHook(() => useScript(src));
  expect(typeof result.current).toBe('string');
});

it('Should display ready status after script loaded', () => {
  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('loading');

  const script = document.querySelector(`script[src="${src}"]`)!;
  act(() => script.dispatchEvent(new Event('load')));

  expect(result.current).toBe('ready');
});

it('Should display error status after error event', () => {
  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('loading');

  const script = document.querySelector(`script[src="${src}"]`)!;
  act(() => script.dispatchEvent(new Event('error')));

  expect(result.current).toBe('error');
});

it('Should remove script after unmount', () => {
  const { result, unmount } = renderHook(() => useScript(src));

  expect(result.current).toBe('loading');

  expect(document.querySelector(`script[src="${src}"]`)).not.toBeNull();

  unmount();

  expect(document.querySelector(`script[src="${src}"]`)).toBeNull();
});

it('Should not remove script if removeOnUnmount is false', () => {
  const { result, unmount } = renderHook(() => useScript(src, { removeOnUnmount: false }));

  expect(result.current).toBe('loading');

  expect(document.querySelector(`script[src="${src}"]`)).not.toBeNull();

  unmount();

  expect(document.querySelector(`script[src="${src}"]`)).not.toBeNull();
});

it('Should display unknown status when script already exist', () => {
  const script = document.createElement('script');
  script.src = src;
  document.body.appendChild(script);

  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('unknown');
});
