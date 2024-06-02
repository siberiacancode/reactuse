import { act, renderHook } from '@testing-library/react';

import { useOnline } from './useOnline';

const mockNavigatorOnline = vi.spyOn(navigator, 'onLine', 'get');

it('Should return true when online', () => {
  mockNavigatorOnline.mockReturnValue(true);
  const { result } = renderHook(useOnline);
  expect(result.current).toBeTruthy();
});

it('Should return false when offline', () => {
  mockNavigatorOnline.mockReturnValue(false);
  const { result } = renderHook(useOnline);
  expect(result.current).toBeFalsy();
});

it('Should change return value upon network events', () => {
  mockNavigatorOnline.mockReturnValue(true);
  const { result } = renderHook(useOnline);
  expect(result.current).toBeTruthy();

  mockNavigatorOnline.mockReturnValue(false);
  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current).toBeFalsy();

  mockNavigatorOnline.mockReturnValue(true);
  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current).toBeTruthy();
});
