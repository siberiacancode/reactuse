import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';

import { useBroadcastChannel } from './useBroadcastChannel';

const trigger = createTrigger<string, (event: MessageEvent) => void>();

const mockBroadcastChannelClose = vi.fn();
const mockBroadcastChannelPostMessage = vi.fn();

const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();

class MockBroadcastChannel {
  static instances: MockBroadcastChannel[] = [];

  constructor(readonly name: string) {
    MockBroadcastChannel.instances.push(this);
  }

  postMessage = mockBroadcastChannelPostMessage;
  close = mockBroadcastChannelClose;
  addEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockAddEventListener(type, callback);
    trigger.add(type, callback);
  };
  removeEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  };
}

const getLastBroadcastChannel = () => MockBroadcastChannel.instances.at(-1)!;

beforeEach(() => {
  MockBroadcastChannel.instances = [];
  trigger.clear();
  Object.assign(globalThis.window, {
    BroadcastChannel: MockBroadcastChannel
  });
});

it('Should use broadcast channel', () => {
  const { result } = renderHook(() => useBroadcastChannel('test-channel'));

  expect(result.current.supported).toBeTruthy();
  expect(result.current.channel).toBeUndefined();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.closed).toBeFalsy();
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use broadcast on server side', () => {
  const { result } = renderHookServer(() => useBroadcastChannel('test-channel'));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.channel).toBeUndefined();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.closed).toBeFalsy();
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use broadcast channel for unsupported', () => {
  Object.assign(globalThis.window, {
    BroadcastChannel: undefined
  });
  const { result } = renderHook(() => useBroadcastChannel('test-channel'));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.channel).toBeUndefined();

  act(() => {
    result.current.post('message');
    result.current.close();
  });

  expect(mockBroadcastChannelPostMessage).not.toHaveBeenCalled();
  expect(mockBroadcastChannelClose).not.toHaveBeenCalled();
  expect(result.current.closed).toBeFalsy();
});

it('Should post messages through channel', () => {
  const { result } = renderHook(() => useBroadcastChannel<string>('test-channel'));

  act(() => result.current.post('message'));

  expect(mockBroadcastChannelPostMessage).toHaveBeenCalledWith('message');
});

it('Should handle closing the channel', () => {
  const { result } = renderHook(() => useBroadcastChannel('test-channel'));

  act(() => result.current.close());

  expect(mockBroadcastChannelClose).toHaveBeenCalled();
  expect(result.current.closed).toBeTruthy();
});

it('Should handle received messages', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useBroadcastChannel<string>('test-channel', callback));

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'message' })));

  expect(result.current.data).toBe('message');
  expect(callback).toHaveBeenCalledWith('message');
});

it('Should receive messages without callback', () => {
  const { result } = renderHook(() => useBroadcastChannel<string>('test-channel'));

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'message' })));

  expect(result.current.data).toBe('message');
});

it('Should use latest callback', () => {
  const callback = vi.fn();
  const nextCallback = vi.fn();
  const { rerender } = renderHook(
    (onMessage) => useBroadcastChannel<string>('test-channel', onMessage),
    { initialProps: callback }
  );
  rerender(nextCallback);

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'message' })));

  expect(callback).not.toHaveBeenCalled();
  expect(nextCallback).toHaveBeenCalledOnce();
  expect(nextCallback).toHaveBeenCalledWith('message');
  expect(MockBroadcastChannel.instances).toHaveLength(1);
  expect(mockBroadcastChannelClose).not.toHaveBeenCalled();
});

it('Should handle message errors', () => {
  const { result } = renderHook(() => useBroadcastChannel('test-channel'));
  const event = new MessageEvent('messageerror', { data: new Error('error') });

  act(() => trigger.callback('messageerror', event));

  expect(result.current.error).toBe(event);
});

it('Should handle close event', () => {
  const { result } = renderHook(() => useBroadcastChannel('test-channel'));

  act(() => trigger.callback('close', new MessageEvent('close')));

  expect(result.current.closed).toBeTruthy();
});

it('Should handle name changes', () => {
  const callback = vi.fn();
  const { result, rerender } = renderHook((name) => useBroadcastChannel(name, callback), {
    initialProps: 'test-channel'
  });
  const channel = getLastBroadcastChannel();

  rerender('new-channel');
  const nextChannel = getLastBroadcastChannel();

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'new' })));

  expect(result.current.data).toBe('new');
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith('new');
  expect(channel.name).toBe('test-channel');
  expect(nextChannel.name).toBe('new-channel');
  expect(mockBroadcastChannelClose).toHaveBeenCalledOnce();
  expect(mockRemoveEventListener).toHaveBeenCalledTimes(3);
});

it('Should cleanup on unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => useBroadcastChannel('test-channel', callback));

  unmount();

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'message' })));

  expect(callback).not.toHaveBeenCalled();
  expect(mockBroadcastChannelClose).toHaveBeenCalledOnce();
  expect(mockRemoveEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('messageerror', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('close', expect.any(Function));
});
