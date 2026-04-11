import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { usePermission } from './usePermission';

const mockQuery = vi.fn();
beforeEach(() => {
  Object.assign(navigator, {
    permissions: { query: mockQuery }
  });
});

it('Should use permission', async () => {
  const { result } = renderHook(() => usePermission('microphone'));

  expect(result.current.supported).toBeTruthy();
  expect(result.current.query).toBeTypeOf('function');
  expect(result.current.state).toBe('prompt');
});

it('Should use permission on server side', () => {
  const { result } = renderHookServer(() => usePermission('microphone'));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.state).toBe('prompt');
  expect(result.current.query).toBeTypeOf('function');
});

it('Should use permission for unsupported', () => {
  Object.assign(navigator, {
    permissions: undefined
  });

  const { result } = renderHook(() => usePermission('microphone'));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.state).toBe('prompt');
});

it('Should handle query method', async () => {
  mockQuery.mockResolvedValue({ state: 'denied' });

  const { result } = renderHook(() => usePermission('camera'));

  await waitFor(() => {
    expect(result.current.state).toBe('denied');
  });

  mockQuery.mockResolvedValue({ state: 'granted' });

  await act(result.current.query);

  expect(result.current.state).toBe('granted');
});

it('Should not query when disabled', async () => {
  const { result } = renderHook(() => usePermission('microphone', { enabled: false }));

  expect(mockQuery).not.toHaveBeenCalled();
  expect(result.current.state).toBe('prompt');
});

it('Should refetch on window change event', async () => {
  mockQuery.mockImplementation(() => Promise.resolve({ state: 'granted' }));

  const { result } = renderHook(() => usePermission('notifications'));

  await waitFor(() => {
    expect(result.current.state).toBe('granted');
  });

  mockQuery.mockImplementation(() => Promise.resolve({ state: 'denied' }));

  await act(async () => {
    window.dispatchEvent(new Event('change'));
  });

  await waitFor(() => {
    expect(result.current.state).toBe('denied');
  });
});

it('Should query on mount', async () => {
  mockQuery.mockImplementation(() => Promise.resolve({ state: 'granted' }));
  const { result } = renderHook(() => usePermission('notifications'));

  expect(result.current.state).toBe('prompt');

  expect(mockQuery).toHaveBeenCalled();
  await waitFor(() => {
    expect(result.current.state).toBe('granted');
  });
});
