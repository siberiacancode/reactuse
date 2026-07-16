import { renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useFps } from './useFps';

it('Should use fps', () => {
  const { result } = renderHook(useFps);
  expect(result.current).toBe(0);
});

it('Should use fps on server side', () => {
  const { result } = renderHookServer(useFps);
  expect(result.current).toBe(0);
});

it('Should calculate fps', () => {
  const requestAnimationFrame = vi.spyOn(window, 'requestAnimationFrame');
  renderHook(useFps);

  expect(requestAnimationFrame).toHaveBeenCalledOnce();
});

it('Should cleanup on unmount', () => {
  const cancelAnimationFrame = vi.spyOn(window, 'cancelAnimationFrame');
  const { unmount } = renderHook(useFps);

  unmount();
  expect(cancelAnimationFrame).toHaveBeenCalledOnce();
});
