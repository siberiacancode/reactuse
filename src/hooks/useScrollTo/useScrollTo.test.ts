import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useScrollTo } from './useScrollTo';

describe('useScrollTo', () => {
  it('should define scrollTo and targetRef', () => {
    const { result } = renderHook(() => useScrollTo());

    expect(result.current.scrollToTarget).toBeDefined();
    expect(result.current.targetToScroll).toBeDefined();
  });

  it('should scroll to target element', () => {
    const { result } = renderHook(() => useScrollTo());
    const scrollIntoViewMock = vi.fn();

    const mockElement = document.createElement('div');
    mockElement.scrollIntoView = scrollIntoViewMock;

    act(() => {
      (result.current.targetToScroll as React.MutableRefObject<HTMLElement | null>).current =
        mockElement;
    });

    act(() => {
      result.current.scrollToTarget();
    });

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  });

  it('should not scroll if targetRef is not set', () => {
    const { result } = renderHook(() => useScrollTo());
    const scrollIntoViewMock = vi.fn();

    act(() => {
      result.current.scrollToTarget();
    });

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
