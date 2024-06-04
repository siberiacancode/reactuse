import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { usePreferredLanguages } from './usePreferredLanguages';

const MockNavigatorLanguages = vi.spyOn(navigator, 'languages', 'get');

it('Should use languages', () => {
  MockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR']);
  const { result } = renderHook(usePreferredLanguages);
  expect(result.current).toEqual(['en', 'en-US', 'fr', 'fr-FR']);
});

it('Should use languages on server', () => {
  const { result } = renderHookServer(usePreferredLanguages);
  expect(result.current).toEqual(['en']);
});

it('Should change value upon language changes', () => {
  MockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR']);
  const { result } = renderHook(usePreferredLanguages);
  expect(result.current).toEqual(['en', 'en-US', 'fr', 'fr-FR']);

  MockNavigatorLanguages.mockReturnValue(['en', 'en-US', 'fr', 'fr-FR', 'de']);
  act(() => window.dispatchEvent(new Event('languagechange')));
  expect(result.current).toEqual(['en', 'en-US', 'fr', 'fr-FR', 'de']);
});
