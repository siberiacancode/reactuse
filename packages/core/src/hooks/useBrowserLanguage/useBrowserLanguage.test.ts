import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useBrowserLanguage } from './useBrowserLanguage';

beforeAll(() => {
  Object.defineProperty(navigator, 'language', {
    value: 'ru',
    writable: true
  });
});

it('Should use browser language', () => {
  const { result } = renderHook(useBrowserLanguage);

  expect(result.current).toBe('ru');
});

it('Should use browser language on server', () => {
  const { result } = renderHookServer(useBrowserLanguage);

  expect(result.current).toBe('undetermined');
});

it('Should handle language change event', () => {
  const { result } = renderHook(useBrowserLanguage);

  expect(result.current).toBe('ru');

  act(() => {
    Object.defineProperty(navigator, 'language', {
      value: 'en',
      writable: true
    });

    window.dispatchEvent(new Event('languagechange'));
  });

  expect(result.current).toBe('en');
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(useBrowserLanguage);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('languagechange', expect.any(Function));
});
