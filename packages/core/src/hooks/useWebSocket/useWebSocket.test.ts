import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useWebSocket } from './useWebSocket';

const mockWebSocketSend = vi.fn();
const mockWebSocketClose = vi.fn();

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  url: string;
  protocols?: string | string[];
  onopen: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    this.protocols = protocols;
    MockWebSocket.instances.push(this);
  }

  send = mockWebSocketSend;

  close = () => {
    mockWebSocketClose();
    this.onclose?.(new CloseEvent('close'));
  };
}

const getLastWebSocket = () => MockWebSocket.instances.at(-1)!;

beforeEach(() => {
  MockWebSocket.instances = [];
  vi.stubGlobal('WebSocket', MockWebSocket);
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it('Should use web socket', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com'));

  expect(result.current.status).toBe('connecting');
  expect(result.current.client).toBeUndefined();
  expect(result.current.send).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
  expect(result.current.open).toBeTypeOf('function');
});

it('Should use web socket on server side', () => {
  const { result } = renderHookServer(() => useWebSocket('wss://example.com'));

  expect(result.current.status).toBe('connecting');
  expect(result.current.client).toBeUndefined();
  expect(result.current.send).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
  expect(result.current.open).toBeTypeOf('function');
});

it('Should handle protocols option', () => {
  renderHook(() => useWebSocket('wss://example.com', { protocols: ['soap', 'wasm'] }));

  expect(getLastWebSocket().protocols).toEqual(['soap', 'wasm']);
});

it('Should not connect immediately when disabled', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com', { immediately: false }));

  expect(MockWebSocket.instances).toHaveLength(0);
  expect(result.current.status).toBe('disconnected');
});

it('Should handle function url', () => {
  const url = vi.fn(() => 'wss://example.com/function');

  renderHook(() => useWebSocket(url));

  expect(url).toHaveBeenCalledOnce();
  expect(getLastWebSocket().url).toBe('wss://example.com/function');
});

it('Should handle onopen event', () => {
  const onConnected = vi.fn();
  const { result } = renderHook(() => useWebSocket('wss://example.com', { onConnected }));

  act(() => getLastWebSocket().onopen!(new Event('open')));

  expect(result.current.status).toBe('connected');
  expect(onConnected).toHaveBeenCalledOnce();
  expect(onConnected).toHaveBeenCalledWith(getLastWebSocket());
});

it('Should handle onerror event', () => {
  const onError = vi.fn();
  const { result } = renderHook(() => useWebSocket('wss://example.com', { onError }));

  const errorEvent = new Event('error');

  act(() => getLastWebSocket().onerror!(errorEvent));

  expect(result.current.status).toBe('failed');
  expect(onError).toHaveBeenCalledOnce();
  expect(onError).toHaveBeenCalledWith(errorEvent, getLastWebSocket());
});

it('Should handle onmessage event', () => {
  const onMessage = vi.fn();
  renderHook(() => useWebSocket('wss://example.com', { onMessage }));

  const messageEvent = new MessageEvent('message', { data: 'hello' });

  act(() => getLastWebSocket().onmessage!(messageEvent));

  expect(onMessage).toHaveBeenCalledOnce();
  expect(onMessage).toHaveBeenCalledWith(messageEvent, getLastWebSocket());
});

it('Should handle onclose event', () => {
  const onClose = vi.fn();
  const { result } = renderHook(() => useWebSocket('wss://example.com', { onClose }));

  const closeEvent = new CloseEvent('close');

  act(() => getLastWebSocket().onclose!(closeEvent));

  expect(result.current.status).toBe('disconnected');
  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose).toHaveBeenCalledWith(closeEvent, getLastWebSocket());
});

it('Should handle send', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com'));

  act(() => result.current.send('message'));

  expect(mockWebSocketSend).toHaveBeenCalledOnce();
  expect(mockWebSocketSend).toHaveBeenCalledWith('message');
});

it('Should handle close', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com'));

  act(() => result.current.close());

  expect(mockWebSocketClose).toHaveBeenCalledOnce();
  expect(result.current.status).toBe('disconnected');
});

it('Should handle open', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com', { immediately: false }));

  expect(result.current.status).toBe('disconnected');

  act(() => result.current.open());

  expect(MockWebSocket.instances).toHaveLength(1);
  expect(result.current.status).toBe('connecting');
});

it('Should retry on disconnected once', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com', { retry: true }));

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(2);
  expect(result.current.status).toBe('connecting');

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(2);
  expect(result.current.status).toBe('disconnected');
});

it('Should retry on disconnected multiple times', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com', { retry: 2 }));

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(2);
  expect(result.current.status).toBe('connecting');

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(3);
  expect(result.current.status).toBe('connecting');

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(3);
  expect(result.current.status).toBe('disconnected');
});

it('Should retry on disconnected with function', () => {
  const retry = vi.fn((failureCount: number) => failureCount < 2);
  const { result } = renderHook(() => useWebSocket('wss://example.com', { retry }));

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(2);
  expect(result.current.status).toBe('connecting');

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(3);
  expect(result.current.status).toBe('connecting');

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(MockWebSocket.instances).toHaveLength(3);
  expect(result.current.status).toBe('disconnected');

  expect(retry).toHaveBeenNthCalledWith(1, 0, expect.any(CloseEvent));
  expect(retry).toHaveBeenNthCalledWith(2, 1, expect.any(CloseEvent));
  expect(retry).toHaveBeenNthCalledWith(3, 2, expect.any(CloseEvent));
});

it('Should not retry when retry function returns false', () => {
  const retry = vi.fn(() => false);
  const { result } = renderHook(() => useWebSocket('wss://example.com', { retry }));

  act(() => getLastWebSocket().onclose!(new CloseEvent('close')));

  expect(retry).toHaveBeenCalledOnce();
  expect(retry).toHaveBeenNthCalledWith(1, 0, expect.any(CloseEvent));
  expect(MockWebSocket.instances).toHaveLength(1);
  expect(result.current.status).toBe('disconnected');
});

it('Should not retry when explicitly closed', () => {
  const { result } = renderHook(() => useWebSocket('wss://example.com', { retry: true }));

  act(() => result.current.close());

  expect(MockWebSocket.instances).toHaveLength(1);
  expect(result.current.status).toBe('disconnected');
});

it('Should handle url changes', () => {
  const { result, rerender } = renderHook((url) => useWebSocket(url), {
    initialProps: 'wss://example.com/first'
  });

  expect(MockWebSocket.instances).toHaveLength(1);
  expect(getLastWebSocket().url).toBe('wss://example.com/first');

  rerender('wss://example.com/second');

  expect(mockWebSocketClose).toHaveBeenCalledOnce();
  expect(MockWebSocket.instances).toHaveLength(2);
  expect(getLastWebSocket().url).toBe('wss://example.com/second');
  expect(result.current.status).toBe('connecting');
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(() => useWebSocket('wss://example.com'));

  unmount();

  expect(mockWebSocketClose).toHaveBeenCalledOnce();
});
