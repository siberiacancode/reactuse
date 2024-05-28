import { act, renderHook } from '@testing-library/react';

import { useDocumentVisibility } from './useDocumentVisibility';

const mockDocumentVisibility = vi.spyOn(document, 'visibilityState', 'get');

describe('useDocumentVisibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('Should use document visibility', () => {
    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe(document.visibilityState);
  });

  it('Should return "hidden" after initialization', () => {
    mockDocumentVisibility.mockReturnValue('hidden');
    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe('hidden');
  });

  it('Should return "visible" after initialization', () => {
    mockDocumentVisibility.mockReturnValue('visible');
    const { result } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe('visible');
  });

  it('Should update visibility state on visibilitychange event', () => {
    mockDocumentVisibility.mockReturnValue('visible');
    const { result, rerender } = renderHook(() => useDocumentVisibility());
    expect(result.current).toBe('visible');

    mockDocumentVisibility.mockReturnValue('hidden');
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    rerender();
    expect(result.current).toBe('hidden');
  });
});
