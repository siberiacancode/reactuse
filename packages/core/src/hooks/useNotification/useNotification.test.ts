import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useNotification } from './useNotification';

const mockNotificationClose = vi.fn();
const mockNotificationRequestPermission = vi.fn<() => Promise<NotificationPermission>>();

class MockNotification {
  static permission: NotificationPermission = 'default';
  static requestPermission = mockNotificationRequestPermission;

  constructor(title: string, options?: NotificationOptions) {
    this.title = title;
    this.options = options ?? {};
  }

  title: string;
  options: NotificationOptions;

  onclick: ((event: Event) => void) | null = null;
  onshow: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;

  close = mockNotificationClose;
}

beforeEach(() => {
  MockNotification.permission = 'default';
  mockNotificationRequestPermission.mockResolvedValue('default');

  Object.defineProperty(document, 'visibilityState', {
    value: 'hidden',
    writable: true,
    configurable: true
  });

  Object.defineProperty(window, 'Notification', {
    value: MockNotification,
    writable: true,
    configurable: true
  });
});

it('Should use notification', () => {
  const { result } = renderHook(useNotification);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.notification).toBeUndefined();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.show).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use notification on server side', () => {
  const { result } = renderHookServer(useNotification);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.notification).toBeUndefined();
  expect(result.current.trigger).toBeTypeOf('function');
  expect(result.current.show).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use notification for unsupported', () => {
  Object.defineProperty(window, 'Notification', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(useNotification);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.notification).toBeUndefined();
});

it('Should trigger permission', async () => {
  mockNotificationRequestPermission.mockResolvedValue('granted');

  const { result } = renderHook(useNotification);

  await expect(act(result.current.trigger)).resolves.toBe(true);
  expect(mockNotificationRequestPermission).toHaveBeenCalledOnce();
});

it('Should trigger permission when denied', async () => {
  mockNotificationRequestPermission.mockResolvedValue('denied');

  const { result } = renderHook(useNotification);

  await expect(act(result.current.trigger)).resolves.toBe(false);
});

it('Should not trigger permission when already granted', async () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  await expect(act(result.current.trigger)).resolves.toBe(true);
  expect(mockNotificationRequestPermission).not.toHaveBeenCalled();
});

it('Should not trigger permission when already denied', async () => {
  MockNotification.permission = 'denied';

  const { result } = renderHook(useNotification);

  await expect(act(result.current.trigger)).resolves.toBe(false);
  expect(mockNotificationRequestPermission).not.toHaveBeenCalled();
});

it('Should not trigger permission for unsupported', async () => {
  Object.defineProperty(window, 'Notification', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(useNotification);

  await expect(act(result.current.trigger)).resolves.toBe(false);
});

it('Should show notification', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello', body: 'World' }));

  const notification = result.current.notification as unknown as MockNotification;

  expect(notification).toBeInstanceOf(MockNotification);
  expect(notification.title).toBe('Hello');
  expect(notification.options.body).toBe('World');
});

it('Should show notification with empty title by default', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show());

  expect((result.current.notification as unknown as MockNotification).title).toBe('');
});

it('Should not pass callbacks to notification options', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() =>
    result.current.show({
      title: 'Hello',
      body: 'World',
      onClick: vi.fn(),
      onClose: vi.fn(),
      onError: vi.fn(),
      onShow: vi.fn()
    })
  );

  expect((result.current.notification as unknown as MockNotification).options).toEqual({
    body: 'World'
  });
});

it('Should show notification after trigger', async () => {
  mockNotificationRequestPermission.mockImplementation(async () => {
    MockNotification.permission = 'granted';
    return 'granted';
  });

  const { result } = renderHook(useNotification);

  await act(result.current.trigger);

  act(() => result.current.show({ title: 'Hello' }));

  expect(result.current.notification).toBeInstanceOf(MockNotification);
});

it('Should close previous notification on repeated show', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'First' }));
  act(() => result.current.show({ title: 'Second' }));

  expect(mockNotificationClose).toHaveBeenCalledOnce();
  expect((result.current.notification as unknown as MockNotification).title).toBe('Second');
});

it('Should not show notification without permission', () => {
  MockNotification.permission = 'default';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello' }));

  expect(result.current.notification).toBeUndefined();
});

it('Should not show notification for unsupported', () => {
  Object.defineProperty(window, 'Notification', {
    value: undefined,
    writable: true,
    configurable: true
  });

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello' }));

  expect(result.current.notification).toBeUndefined();
});

it('Should call onClick when notification is clicked', () => {
  MockNotification.permission = 'granted';
  const onClick = vi.fn();

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello', onClick }));

  act(() => {
    const notification = result.current.notification as unknown as MockNotification;
    notification.onclick?.(new Event('click'));
  });

  expect(onClick).toHaveBeenCalledWith(expect.any(Event));
});

it('Should call onShow when notification is shown', () => {
  MockNotification.permission = 'granted';
  const onShow = vi.fn();

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello', onShow }));

  act(() => {
    const notification = result.current.notification as unknown as MockNotification;
    notification.onshow?.(new Event('show'));
  });

  expect(onShow).toHaveBeenCalledWith(expect.any(Event));
});

it('Should call onError when notification errors', () => {
  MockNotification.permission = 'granted';
  const onError = vi.fn();

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello', onError }));

  act(() => {
    const notification = result.current.notification as unknown as MockNotification;
    notification.onerror?.(new Event('error'));
  });

  expect(onError).toHaveBeenCalledWith(expect.any(Event));
});

it('Should call onClose and clear notification when closed', () => {
  MockNotification.permission = 'granted';
  const onClose = vi.fn();

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello', onClose }));

  act(() => {
    const notification = result.current.notification as unknown as MockNotification;
    notification.onclose?.(new Event('close'));
  });

  expect(onClose).toHaveBeenCalledWith(expect.any(Event));
  expect(result.current.notification).toBeUndefined();
});

it('Should not clear notification when stale instance closes', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'First' }));

  const first = result.current.notification as unknown as MockNotification;

  act(() => result.current.show({ title: 'Second' }));

  act(() => first.onclose?.(new Event('close')));

  expect((result.current.notification as unknown as MockNotification).title).toBe('Second');
});

it('Should close notification', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello' }));

  expect(result.current.notification).toBeDefined();

  act(result.current.close);

  expect(mockNotificationClose).toHaveBeenCalledOnce();
  expect(result.current.notification).toBeUndefined();
});

it('Should not close notification when tab becomes hidden', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello' }));

  act(() => document.dispatchEvent(new Event('visibilitychange')));

  expect(mockNotificationClose).not.toHaveBeenCalled();
  expect(result.current.notification).toBeDefined();
});

it('Should close notification when tab becomes visible', () => {
  MockNotification.permission = 'granted';

  const { result } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello' }));

  Object.defineProperty(document, 'visibilityState', {
    value: 'visible',
    writable: true,
    configurable: true
  });

  act(() => document.dispatchEvent(new Event('visibilitychange')));

  expect(mockNotificationClose).toHaveBeenCalledOnce();
  expect(result.current.notification).toBeUndefined();
});

it('Should not clear on unmount when not shown', () => {
  MockNotification.permission = 'granted';

  const { unmount } = renderHook(useNotification);

  unmount();

  expect(mockNotificationClose).not.toHaveBeenCalled();
});

it('Should clear on unmount', () => {
  MockNotification.permission = 'granted';

  const mockDocumentRemoveEventListener = vi.spyOn(document, 'removeEventListener');

  const { result, unmount } = renderHook(useNotification);

  act(() => result.current.show({ title: 'Hello' }));

  unmount();

  expect(mockNotificationClose).toHaveBeenCalledOnce();
  expect(mockDocumentRemoveEventListener).toHaveBeenCalledWith(
    'visibilitychange',
    expect.any(Function)
  );
});
