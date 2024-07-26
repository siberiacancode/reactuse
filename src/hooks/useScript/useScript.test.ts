import { act, renderHook } from '@testing-library/react';

import { useScript } from './useScript';

const src = 'https://example.com/script.js';

it('Should use script', () => {
  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('loading');
});

it('Should display ready status after script loaded', () => {
  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('loading');

  act(() => {
    const script = document.querySelector(`script[src="${src}"]`);
    script?.dispatchEvent(new Event('load'));
  });

  expect(result.current).toBe('ready');
});

it('Should display error status after error event', () => {
  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('loading');

  act(() => {
    const script = document.querySelector(`script[src="${src}"]`);
    script?.dispatchEvent(new Event('error'));
  });

  expect(result.current).toBe('error');
});

it('Should display uknown status when script already exist', () => {
  act(() => {
    const script = document.createElement('script');
    script.src = src;

    document.body.appendChild(script);
  });

  const { result } = renderHook(() => useScript(src));

  expect(result.current).toBe('unknown');
});
