import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useDocumentVisibility } from './useDocumentVisibility';

const mockDocumentVisibility = vi.spyOn(document, 'visibilityState', 'get');

it('Should use document visibility', () => {
  const { result } = renderHook(useDocumentVisibility);
  expect(result.current).toBe(document.visibilityState);
});

it('Should use document visibility on server', () => {
  const { result } = renderHookServer(useDocumentVisibility);
  expect(result.current).toBe('hidden');
});

it('Should return "hidden" after initialization', () => {
  mockDocumentVisibility.mockReturnValue('hidden');
  const { result } = renderHook(useDocumentVisibility);
  expect(result.current).toBe('hidden');
});

it('Should return "visible" after initialization', () => {
  mockDocumentVisibility.mockReturnValue('visible');
  const { result } = renderHook(useDocumentVisibility);
  expect(result.current).toBe('visible');
});

it('Should update visibility state on visibilitychange event', () => {
  mockDocumentVisibility.mockReturnValue('visible');
  const { result } = renderHook(useDocumentVisibility);
  expect(result.current).toBe('visible');

  mockDocumentVisibility.mockReturnValue('hidden');
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(result.current).toBe('hidden');

  mockDocumentVisibility.mockReturnValue('visible');
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(result.current).toBe('visible');
});
