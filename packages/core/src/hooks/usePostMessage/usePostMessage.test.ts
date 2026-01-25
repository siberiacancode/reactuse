import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePostMessage } from './usePostMessage';

const trigger = createTrigger<string, (event: Event) => void>();

beforeEach(() => {
  vi.clearAllMocks();
  trigger.clear();

  Object.assign(window, {
    postMessage: (message: any, origin: string) => {
      trigger.callback('message', new MessageEvent('message', { data: message, origin }));
      return true;
    },
    addEventListener: (type: string, callback: (event: Event) => void) => {
      trigger.add(type, callback);
    },
    removeEventListener: (type: string, callback: (event: Event) => void) => {
      if (trigger.get(type) === callback) trigger.delete(type);
    },
    dispatchEvent: (event: Event) => {
      trigger.callback(event.type, event);
      return true;
    }
  });
});

it('Should use post message', () => {
  const { result } = renderHook(() => usePostMessage('*', vi.fn()));
  expect(result.current).toBeTypeOf('function');
});

it('Should use post message on server side', () => {
  const { result } = renderHookServer(() => usePostMessage('*', vi.fn()));
  expect(result.current).toBeTypeOf('function');
});

it('Should post message when handler is called', () => {
  const callback = vi.fn();
  const { result } = renderHook(() => usePostMessage('*', callback));

  act(() => result.current({ value: 'message' }));

  expect(callback).toHaveBeenCalledOnce();
});

it('Should filter by origin', () => {
  const callback = vi.fn();
  renderHook(() => usePostMessage('allowed-origin', callback));

  act(() =>
    trigger.callback(
      'message',
      new MessageEvent('message', { data: 'message', origin: 'blocked-origin' })
    )
  );

  expect(callback).not.toHaveBeenCalled();

  act(() =>
    trigger.callback(
      'message',
      new MessageEvent('message', { data: 'message', origin: 'allowed-origin' })
    )
  );

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(
    'message',
    expect.objectContaining({ data: 'message', origin: 'allowed-origin' })
  );
});

it('Should post to each origin when origin is array', () => {
  const callback = vi.fn();
  renderHook(() => usePostMessage(['a', 'b'], callback));

  act(() =>
    trigger.callback('message', new MessageEvent('message', { data: 'payload', origin: 'a' }))
  );

  expect(callback).toHaveBeenCalledWith('payload', expect.objectContaining({ origin: 'a' }));
  expect(callback).toHaveBeenCalledOnce();

  act(() =>
    trigger.callback('message', new MessageEvent('message', { data: 'payload', origin: 'b' }))
  );

  expect(callback).toHaveBeenCalledWith('payload', expect.objectContaining({ origin: 'b' }));
  expect(callback).toHaveBeenCalledTimes(2);

  act(() =>
    trigger.callback('message', new MessageEvent('message', { data: 'payload', origin: 'c' }))
  );
  expect(callback).toHaveBeenCalledTimes(2);
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  const { unmount } = renderHook(() => usePostMessage('*', vi.fn()));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
});
