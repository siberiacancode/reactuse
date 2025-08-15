import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { createTrigger, renderHookServer } from '@/tests';

import { useBroadcastChannel } from './useBroadcastChannel';

const channelName = 'test-channel';
const trigger = createTrigger<string, (event: MessageEvent) => void>();

const mockBroadcastChannelClose = vi.fn();
const mockBroadcastChannelPostMessage = vi.fn();

const mockRemoveEventListener = vi.fn();
const mockAddEventListener = vi.fn();

class MockBroadcastChannel {
  postMessage = mockBroadcastChannelPostMessage;
  close = mockBroadcastChannelClose;
  addEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockAddEventListener();
    trigger.add(type, callback);
  };
  removeEventListener = (type: string, callback: (event: MessageEvent) => void) => {
    mockRemoveEventListener(type, callback);
    if (trigger.get(type) === callback) trigger.delete(type);
  };
}

beforeEach(() => {
  Object.assign(globalThis.window, {
    BroadcastChannel: MockBroadcastChannel
  });
});

afterEach(vi.clearAllMocks);

it('Should use broadcast channel', () => {
  const { result } = renderHook(() => useBroadcastChannel(channelName));

  expect(result.current.supported).toBe(true);
  expect(result.current.channel).toBeUndefined();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.closed).toBe(false);
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should use broadcast on server side', () => {
  const { result } = renderHookServer(() => useBroadcastChannel(channelName));

  expect(result.current.supported).toBe(false);
  expect(result.current.channel).toBeUndefined();
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.closed).toBe(false);
  expect(result.current.post).toBeTypeOf('function');
  expect(result.current.close).toBeTypeOf('function');
});

it('Should correct return for unsupported broadcast channel', () => {
  Object.assign(globalThis.window, {
    BroadcastChannel: undefined
  });
  const { result } = renderHook(() => useBroadcastChannel(channelName));

  expect(result.current.supported).toBeFalsy();
  expect(result.current.channel).toBeUndefined();
});

it('Should post messages through channel', () => {
  const { result } = renderHook(() => useBroadcastChannel<string>(channelName));

  act(() => result.current.post('message'));

  expect(mockBroadcastChannelPostMessage).toHaveBeenCalledWith('message');
});

it('Should handle closing the channel', () => {
  const { result } = renderHook(() => useBroadcastChannel(channelName));

  act(() => result.current.close());

  expect(mockBroadcastChannelClose).toHaveBeenCalled();
  expect(result.current.closed).toBe(true);
});

it('Should handle received messages', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => useBroadcastChannel<string>(channelName, callback));

  act(() => trigger.callback('message', new MessageEvent('message', { data: 'message' })));

  expect(result.current.data).toBe('message');
  expect(callback).toHaveBeenCalledWith('message');
});

it('Should handle message errors', () => {
  const { result } = renderHook(() => useBroadcastChannel(channelName));

  act(() =>
    trigger.callback('messageerror', new MessageEvent('messageerror', { data: new Error('error') }))
  );

  expect(result.current.error).toBeDefined();
});

it('Should handle close event', () => {
  const { result } = renderHook(() => useBroadcastChannel(channelName));

  act(() => trigger.callback('close', new MessageEvent('close')));

  expect(result.current.closed).toBe(true);
});

it('Should cleanup and reinitialize when name changes', () => {
  const { rerender } = renderHook((name) => useBroadcastChannel(name), {
    initialProps: channelName
  });

  expect(mockAddEventListener).toHaveBeenCalledTimes(3);

  rerender('new-channel');

  expect(mockBroadcastChannelClose).toHaveBeenCalled();
  expect(mockRemoveEventListener).toHaveBeenCalledTimes(3);
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(() => useBroadcastChannel(channelName));

  unmount();

  expect(mockBroadcastChannelClose).toHaveBeenCalled();
  expect(mockRemoveEventListener).toHaveBeenCalledWith('message', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('messageerror', expect.any(Function));
  expect(mockRemoveEventListener).toHaveBeenCalledWith('close', expect.any(Function));
});
