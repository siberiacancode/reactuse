import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';

import { useEventSource } from './useEventSource';

const trigger = createTrigger<string, (event: MessageEvent) => void>();

const mockEventSourceClose = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

class MockEventSource {
  url: string;
  withCredentials: boolean;
  readyState: number;
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;

  constructor(url: string, options?: EventSourceInit) {
    this.url = url;
    this.withCredentials = options?.withCredentials ?? false;
    this.readyState = EventSource.CONNECTING;
  }

  close = mockEventSourceClose;
  addEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  };
  removeEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    console.log('@removeEventListener', removeEventListener);
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  };

  dispatchEvent = (event: Event) => {
    trigger.callback(event.type);
    return true;
  };
}

beforeEach(() => {
  vi.stubGlobal('EventSource', MockEventSource);
  trigger.clear();
});

afterEach(vi.clearAllMocks);

it('Should use event source', () => {
  const { result } = renderHook(() => useEventSource('https://example.com/events'));

  expect(result.current.isConnecting).toBeTruthy();
  expect(result.current.opened).toBeFalsy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.instance).toBeDefined();
  expect(result.current.close).toBeTypeOf('function');
  expect(result.current.open).toBeTypeOf('function');
});

it('Should use event source on server side', () => {
  const { result } = renderHookServer(() => useEventSource('https://example.com/events'));

  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.opened).toBeFalsy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.instance).toBeUndefined();
  expect(result.current.close).toBeTypeOf('function');
  expect(result.current.open).toBeTypeOf('function');
});

it('Should handle onopen event', () => {
  const onOpen = vi.fn();
  const { result } = renderHook(() => useEventSource('https://example.com/events', [], { onOpen }));

  expect(result.current.isConnecting).toBeTruthy();
  expect(result.current.opened).toBeFalsy();

  act(() => result.current.instance!.onopen!(new Event('open')));

  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.opened).toBeTruthy();
  expect(result.current.isError).toBeFalsy();
  expect(result.current.error).toBeUndefined();
  expect(onOpen).toHaveBeenCalledTimes(1);
});

it('Should handle onerror event', () => {
  const onError = vi.fn();
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], { onError })
  );

  const errorEvent = new Event('error');
  act(() => result.current.instance!.onerror!(errorEvent));

  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.opened).toBeFalsy();
  expect(result.current.isError).toBeTruthy();
  expect(result.current.error).toBe(errorEvent);
  expect(onError).toHaveBeenCalledTimes(1);
  expect(onError).toHaveBeenCalledWith(errorEvent);
});

it('Should handle onmessage event', () => {
  const onMessage = vi.fn();
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], { onMessage })
  );

  const messageEvent = new MessageEvent('message', { data: 'value' });
  act(() => result.current.instance!.onmessage!(messageEvent));

  expect(result.current.data).toBe('value');
  expect(onMessage).toHaveBeenCalledTimes(1);
  expect(onMessage).toHaveBeenCalledWith(messageEvent);
});

it('Should handle custom events', () => {
  const { result } = renderHook(() => useEventSource('https://example.com/events', ['message']));

  expect(mockAddEventListener).toHaveBeenCalledTimes(1);
  expect(mockAddEventListener).toHaveBeenCalledWith('message', expect.any(Function));

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'message' })));

  expect(result.current.data).toBe('message');
});

it('Should handle select function', () => {
  const select = vi.fn((data: string) => JSON.parse(data));
  const { result } = renderHook(() => useEventSource('https://example.com/events', [], { select }));

  const messageEvent = new MessageEvent('message', {
    data: '{"key": "value"}'
  });
  act(() => result.current.instance!.onmessage!(messageEvent));

  expect(select).toHaveBeenCalledTimes(1);
  expect(select).toHaveBeenCalledWith('{"key": "value"}');
  expect(result.current.data).toEqual({ key: 'value' });
});

it('Should handle placeholderData', () => {
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], {
      placeholderData: 'initial'
    })
  );

  expect(result.current.data).toBe('initial');
});

it('Should handle placeholderData as function', () => {
  const placeholderData = vi.fn(() => 'initial');
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], { placeholderData })
  );

  expect(result.current.data).toBe('initial');
});

it('Should handle close', () => {
  const { result } = renderHook(() => useEventSource('https://example.com/events'));

  expect(result.current.instance).toBeDefined();

  act(() => result.current.close());

  expect(mockEventSourceClose).toHaveBeenCalledTimes(1);
  expect(result.current.opened).toBeFalsy();
  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.isError).toBeFalsy();
});

it('Should handle open', () => {
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], { immediately: false })
  );

  expect(result.current.instance).toBeUndefined();

  act(() => result.current.open());

  expect(result.current.instance).toBeDefined();
  expect(result.current.isConnecting).toBeTruthy();
});

it('Should handle withCredentials option', () => {
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], { withCredentials: true })
  );

  expect(result.current.instance!.withCredentials).toBeTruthy();
});

it('Should retry on error once', async () => {
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], {
      retry: true
    })
  );

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeTruthy());

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeFalsy());

  act(() => result.current.instance!.onopen!(new Event('open')));

  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.opened).toBeTruthy();
});

it('Should retry on error multiple times', async () => {
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], {
      retry: 2
    })
  );

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeTruthy());

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeTruthy());

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeFalsy());
});

it('Should retry with delay', async () => {
  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], {
      retry: 1,
      retryDelay: 100
    })
  );

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeTruthy());

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeFalsy());

  act(() => result.current.instance!.onopen!(new Event('open')));

  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.opened).toBeTruthy();
});

it('Should retry with function delay', async () => {
  const retryDelay = vi.fn(() => 100);

  const { result } = renderHook(() =>
    useEventSource('https://example.com/events', [], {
      retry: 1,
      retryDelay
    })
  );

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeTruthy());

  act(() => result.current.instance!.onerror!(new Event('error')));

  await waitFor(() => expect(result.current.isConnecting).toBeFalsy());

  act(() => result.current.instance!.onopen!(new Event('open')));

  expect(result.current.isConnecting).toBeFalsy();
  expect(result.current.opened).toBeTruthy();
  expect(retryDelay).toHaveBeenCalledTimes(1);
});

it('Should handle URL object', () => {
  const url = new URL('https://example.com/events');
  const { result } = renderHook(() => useEventSource(url));

  expect(result.current.instance).toBeDefined();
  expect(result.current.instance!.url.toString()).toBe('https://example.com/events');
});

it('Should cleanup on unmount', () => {
  const { result, unmount } = renderHook(() =>
    useEventSource('https://example.com/events', ['message'])
  );

  expect(mockAddEventListener).toHaveBeenCalledTimes(1);

  expect(result.current.instance).toBeDefined();

  unmount();

  expect(mockEventSourceClose).toHaveBeenCalledTimes(1);
  expect(mockRemoveEventListener).toHaveBeenCalledWith('message', expect.any(Function));
});
