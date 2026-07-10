import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useNotification } from './useNotification';

const mockNotificationClose = vi.fn();

class MockNotification {
  static permission: NotificationPermission = 'default';
  static requestPermission = vi.fn<() => Promise<NotificationPermission>>();

  title: string;
  options: NotificationOptions;

  onclick: ((event: Event) => void) | null = null;
  onshow: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;

  constructor(title: string, options?: NotificationOptions) {
    this.title = title;
    this.options = options ?? {};
  }

  close = mockNotificationClose;
}

beforeEach(() => {
  MockNotification.permission = 'default';
  MockNotification.requestPermission.mockClear();
  MockNotification.requestPermission.mockResolvedValue('default');

  Object.defineProperty(window, 'Notification', {
    value: MockNotification,
    writable: true,
    configurable: true
  });

  mockNotificationClose.mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('Should use notification', () => {
  const { result } = renderHook(() => useNotification());

  expect(result.current.supported).toBeTruthy();
  expect(result.current.permission).toBe('default');
  expect(result.current.notification).toBeNull();
  expect(result.current.requestPermission).toBeTypeOf('function');
  expect(result.current.show).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use notification on server side', () => {
  const { result } = renderHookServer(() => useNotification());

  expect(result.current.supported).toBeFalsy();
  expect(result.current.permission).toBe('default');
  expect(result.current.notification).toBeNull();
  expect(result.current.requestPermission).toBeTypeOf('function');
  expect(result.current.show).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use notification for unsupported browser', () => {
  Object.defineProperty(window, 'Notification', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useNotification());

  expect(result.current.supported).toBeFalsy();
  expect(result.current.permission).toBe('default');
});

it('Should read initial permission from Notification.permission', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(() => useNotification());

  expect(result.current.permission).toBe('granted');
});

it('Should request permission and return true when granted', async () => {
  MockNotification.requestPermission.mockResolvedValue('granted');

  const { result } = renderHook(() => useNotification());

  let granted: boolean | undefined;
  await act(async () => {
    granted = await result.current.requestPermission();
  });

  expect(granted).toBe(true);
  expect(result.current.permission).toBe('granted');
});

it('Should request permission and return false when denied', async () => {
  MockNotification.requestPermission.mockResolvedValue('denied');

  const { result } = renderHook(() => useNotification());

  let granted: boolean | undefined;
  await act(async () => {
    granted = await result.current.requestPermission();
  });

  expect(granted).toBe(false);
  expect(result.current.permission).toBe('denied');
});

it('Should not call requestPermission when already granted', async () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(() => useNotification());

  let granted: boolean | undefined;
  await act(async () => {
    granted = await result.current.requestPermission();
  });

  expect(granted).toBe(true);
  expect(MockNotification.requestPermission).not.toHaveBeenCalled();
});

it('Should not call requestPermission when already denied', async () => {
  MockNotification.permission = 'denied';

  const { result } = renderHook(() => useNotification());

  let granted: boolean | undefined;
  await act(async () => {
    granted = await result.current.requestPermission();
  });

  expect(granted).toBe(false);
  expect(MockNotification.requestPermission).not.toHaveBeenCalled();
});

it('Should return false when requesting permission on unsupported browser', async () => {
  Object.defineProperty(window, 'Notification', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useNotification());

  let granted: boolean | undefined;
  await act(async () => {
    granted = await result.current.requestPermission();
  });

  expect(granted).toBe(false);
});

it('Should show a notification when permission is granted', async () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(() => useNotification());

  await act(async () => {
    await result.current.show({ title: 'Hello', body: 'World' });
  });

  expect(result.current.notification).toBeInstanceOf(MockNotification);
  expect((result.current.notification as unknown as MockNotification).title).toBe('Hello');
});

it('Should show a notification after requesting permission', async () => {
  MockNotification.requestPermission.mockResolvedValue('granted');

  const { result } = renderHook(() => useNotification());

  let notification: Notification | undefined;
  await act(async () => {
    await result.current.requestPermission();
    notification = await result.current.show({ title: 'Hello', body: 'World' });
  });

  expect(notification).toBeInstanceOf(MockNotification);
  expect(result.current.notification).toBe(notification);
});

it('Should merge default options with show overrides', async () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(() => useNotification({ title: 'Default', body: 'Default body' }));

  await act(async () => {
    await result.current.show({ title: 'Override' });
  });

  const n = result.current.notification as unknown as MockNotification;
  expect(n.title).toBe('Override');
  expect(n.options.body).toBe('Default body');
});

it('Should return undefined when showing notification without permission', async () => {
  MockNotification.permission = 'default';

  const { result } = renderHook(() => useNotification());

  let notification: Notification | undefined;
  await act(async () => {
    notification = await result.current.show({ title: 'Hello' });
  });

  expect(notification).toBeUndefined();
  expect(result.current.notification).toBeNull();
});

it('Should return undefined when showing notification on unsupported browser', async () => {
  Object.defineProperty(window, 'Notification', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useNotification());

  let notification: Notification | undefined;
  await act(async () => {
    notification = await result.current.show({ title: 'Hello' });
  });

  expect(notification).toBeUndefined();
});

it('Should call onClick callback when notification is clicked', async () => {
  MockNotification.permission = 'granted';
  const onClick = vi.fn();

  const { result } = renderHook(() => useNotification({ onClick }));

  await act(async () => {
    await result.current.show({ title: 'Hello' });
  });

  act(() => {
    const n = result.current.notification as unknown as MockNotification;
    n.onclick?.(new Event('click'));
  });

  expect(onClick).toHaveBeenCalledWith(expect.any(Event));
});

it('Should call onShow callback when notification is shown', async () => {
  MockNotification.permission = 'granted';
  const onShow = vi.fn();

  const { result } = renderHook(() => useNotification({ onShow }));

  await act(async () => {
    await result.current.show({ title: 'Hello' });
  });

  act(() => {
    const n = result.current.notification as unknown as MockNotification;
    n.onshow?.(new Event('show'));
  });

  expect(onShow).toHaveBeenCalledWith(expect.any(Event));
});

it('Should call onError callback when notification errors', async () => {
  MockNotification.permission = 'granted';
  const onError = vi.fn();

  const { result } = renderHook(() => useNotification({ onError }));

  await act(async () => {
    await result.current.show({ title: 'Hello' });
  });

  act(() => {
    const n = result.current.notification as unknown as MockNotification;
    n.onerror?.(new Event('error'));
  });

  expect(onError).toHaveBeenCalledWith(expect.any(Event));
});

it('Should call onClose callback and clear notification when closed', async () => {
  MockNotification.permission = 'granted';
  const onClose = vi.fn();

  const { result } = renderHook(() => useNotification({ onClose }));

  await act(async () => {
    await result.current.show({ title: 'Hello' });
  });

  act(() => {
    const n = result.current.notification as unknown as MockNotification;
    n.onclose?.(new Event('close'));
  });

  await waitFor(() => {
    expect(result.current.notification).toBeNull();
  });

  expect(onClose).toHaveBeenCalledWith(expect.any(Event));
});

it('Should close the current notification', async () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(() => useNotification());

  await act(async () => {
    await result.current.show({ title: 'Hello' });
  });

  expect(result.current.notification).not.toBeNull();

  act(() => {
    result.current.close();
  });

  expect(mockNotificationClose).toHaveBeenCalled();
  expect(result.current.notification).toBeNull();
});

it('Should close the notification on unmount', async () => {
  MockNotification.permission = 'granted';

  const { result, unmount } = renderHook(() => useNotification());

  await act(async () => {
    await result.current.show({ title: 'Hello' });
  });

  unmount();

  expect(mockNotificationClose).toHaveBeenCalled();
});
