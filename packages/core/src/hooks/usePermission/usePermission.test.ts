import { act, renderHook, waitFor } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePermission } from './usePermission';

const trigger = createTrigger<string, () => void>();

const mockPermissionStatusAddEventListener = vi.fn();
const mockPermissionStatusRemoveEventListener = vi.fn();

const createMockPermissionStatus = (name: string, state: PermissionState) => {
  const status = {
    state,
    addEventListener: (type: string, listener: () => void) => {
      trigger.add(name, listener);
      mockPermissionStatusAddEventListener(type, listener);
    },
    removeEventListener: (type: string, listener: () => void) => {
      trigger.delete(name);
      mockPermissionStatusRemoveEventListener(type, listener);
    }
  };

  return status;
};

const mockNavigatorPermissionsQuery = vi.fn();

Object.assign(navigator, {
  permissions: { query: mockNavigatorPermissionsQuery }
});

beforeEach(() => {
  trigger.clear();

  Object.assign(navigator, {
    permissions: { query: mockNavigatorPermissionsQuery }
  });
  mockNavigatorPermissionsQuery.mockResolvedValue(createMockPermissionStatus('camera', 'prompt'));
});

it('Should use permission', () => {
  const { result } = renderHook(() => usePermission('microphone'));

  expect(result.current.supported).toBe(true);
  expect(result.current.state).toBe('prompt');
  expect(result.current.query).toBeTypeOf('function');
});

it('Should use permission on server side', () => {
  const { result } = renderHookServer(() => usePermission('microphone'));

  expect(result.current.supported).toBe(false);
  expect(result.current.state).toBe('prompt');
  expect(result.current.query).toBeTypeOf('function');
});

it('Should use permission for unsupported', () => {
  Object.assign(navigator, { permissions: undefined });

  const { result } = renderHook(() => usePermission('microphone'));

  expect(result.current.supported).toBe(false);
  expect(result.current.state).toBe('prompt');
  expect(mockNavigatorPermissionsQuery).not.toHaveBeenCalled();
});

it('Should query permission on mount', async () => {
  mockNavigatorPermissionsQuery.mockResolvedValue(
    createMockPermissionStatus('notifications', 'granted')
  );

  const { result } = renderHook(() => usePermission('notifications'));

  expect(result.current.state).toBe('prompt');
  expect(mockNavigatorPermissionsQuery).toHaveBeenCalledOnce();
  expect(mockNavigatorPermissionsQuery).toHaveBeenCalledWith({ name: 'notifications' });

  await waitFor(() => expect(result.current.state).toBe('granted'));
});

it('Should query permission manually', async () => {
  mockNavigatorPermissionsQuery.mockResolvedValue(createMockPermissionStatus('camera', 'denied'));

  const { result } = renderHook(() => usePermission('camera'));

  await waitFor(() => expect(result.current.state).toBe('denied'));

  mockNavigatorPermissionsQuery.mockResolvedValue(createMockPermissionStatus('camera', 'granted'));

  await act(result.current.query);

  expect(result.current.state).toBe('granted');
});

it('Should return prompt from query for unsupported', async () => {
  Object.assign(navigator, { permissions: undefined });

  const { result } = renderHook(() => usePermission('microphone'));

  await expect(result.current.query()).resolves.toBe('prompt');
});

it('Should fallback to prompt when query rejects', async () => {
  mockNavigatorPermissionsQuery.mockRejectedValue(new TypeError('invalid permission name'));

  const { result } = renderHook(() => usePermission('speaker'));

  await waitFor(() => expect(mockNavigatorPermissionsQuery).toHaveBeenCalledOnce());

  expect(result.current.state).toBe('prompt');
});

it('Should update state when permission status changes', async () => {
  const status = createMockPermissionStatus('notifications', 'granted');
  mockNavigatorPermissionsQuery.mockResolvedValue(status);

  const { result } = renderHook(() => usePermission('notifications'));

  await waitFor(() => expect(result.current.state).toBe('granted'));

  status.state = 'denied';

  act(() => trigger.callback('notifications'));

  expect(result.current.state).toBe('denied');
});

it('Should call callback when permission status changes', async () => {
  const callback = vi.fn();
  const status = createMockPermissionStatus('camera', 'prompt');
  mockNavigatorPermissionsQuery.mockResolvedValue(status);

  renderHook(() => usePermission('camera', callback));

  await waitFor(() => expect(mockPermissionStatusAddEventListener).toHaveBeenCalledOnce());

  expect(callback).not.toHaveBeenCalled();

  status.state = 'granted';

  act(() => trigger.callback('camera'));

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith('granted');
});

it('Should call onChange option when permission status changes', async () => {
  const onChange = vi.fn();
  const status = createMockPermissionStatus('microphone', 'prompt');
  mockNavigatorPermissionsQuery.mockResolvedValue(status);

  renderHook(() => usePermission('microphone', { onChange }));

  await waitFor(() => expect(mockPermissionStatusAddEventListener).toHaveBeenCalledOnce());

  status.state = 'denied';

  act(() => trigger.callback('microphone'));

  expect(onChange).toHaveBeenCalledOnce();
  expect(onChange).toHaveBeenCalledWith('denied');
});

it('Should not call callback on manual query', async () => {
  const callback = vi.fn();
  mockNavigatorPermissionsQuery.mockResolvedValue(createMockPermissionStatus('camera', 'granted'));

  const { result } = renderHook(() => usePermission('camera', callback));

  await waitFor(() => expect(result.current.state).toBe('granted'));

  await act(result.current.query);

  expect(callback).not.toHaveBeenCalled();
});

it('Should requery permission on name change', async () => {
  const { rerender } = renderHook(({ name }) => usePermission(name), {
    initialProps: { name: 'camera' as const }
  });

  await waitFor(() =>
    expect(mockNavigatorPermissionsQuery).toHaveBeenCalledWith({ name: 'camera' })
  );

  rerender({ name: 'microphone' as any });

  await waitFor(() =>
    expect(mockNavigatorPermissionsQuery).toHaveBeenCalledWith({ name: 'microphone' })
  );
});

it('Should clear on unmount', async () => {
  mockNavigatorPermissionsQuery.mockResolvedValue(createMockPermissionStatus('camera', 'granted'));

  const { unmount } = renderHook(() => usePermission('camera'));

  await waitFor(() => expect(mockPermissionStatusAddEventListener).toHaveBeenCalledOnce());

  unmount();

  expect(mockPermissionStatusRemoveEventListener).toHaveBeenCalledOnce();
});
