import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAsync } from './useAsync';

const successfulCallback = vi.fn((data = 'test data') => Promise.resolve(data));
const failingCallback = vi.fn((error = new Error('Something went wrong')) => Promise.reject(error));

describe('useAsync', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useAsync(successfulCallback, []));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();

    expect(successfulCallback).toHaveBeenCalledOnce();
  });

  it('should handle a successful promise resolution', async () => {
    const { result } = renderHook(() => useAsync(successfulCallback, []));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBe('test data');
  });

  it('should handle a failed promise rejection', async () => {
    const error = new Error('Async error');
    const { result } = renderHook(() => useAsync(() => failingCallback(error), []));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });

  it('should not re-run the callback if dependencies have not changed', async () => {
    const { rerender } = renderHook(() => useAsync(successfulCallback, [1]));

    await waitFor(() => expect(successfulCallback).toHaveBeenCalledOnce());

    rerender();

    expect(successfulCallback).toHaveBeenCalledOnce();
  });

  it('should re-run the callback when dependencies change', async () => {
    const { rerender } = renderHook(({ deps }) => useAsync(successfulCallback, deps), {
      initialProps: { deps: [1] }
    });

    await waitFor(() => expect(successfulCallback).toHaveBeenCalledOnce());

    rerender({ deps: [2] });

    await waitFor(() => expect(successfulCallback).toHaveBeenCalledTimes(2));
    expect(successfulCallback).toHaveBeenCalledTimes(2);
  });
});
