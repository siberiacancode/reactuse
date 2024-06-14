import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { usePreferredLanguages } from './usePreferredLanguages';

const mockNavigatorLanguages = vi.spyOn(navigator, 'languages', 'get');

it('Should use preferred languages', () => {
  mockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR']);
  const { result } = renderHook(usePreferredLanguages);
  expect(result.current).toEqual(['en', 'en-US', 'fr', 'fr-FR']);
});

it('Should use preferred languages on server', () => {
  const { result } = renderHookServer(usePreferredLanguages);
  expect(result.current).toEqual([]);
});

it('Should change value upon language changes', () => {
  mockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR']);
  const { result } = renderHook(usePreferredLanguages);
  expect(result.current).toEqual(['en', 'en-US', 'fr', 'fr-FR']);

  mockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR', 'de']);
  act(() => window.dispatchEvent(new Event('languagechange')));
  expect(result.current).toEqual(['en', 'en-US', 'fr', 'fr-FR', 'de']);
});
