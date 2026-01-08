import { act, renderHook } from '@testing-library/react';

import { createTrigger, renderHookServer } from '@/tests';

import { usePostMessage } from './usePostMessage';

const trigger = createTrigger<string, (event: Event) => void>();
const mockPostMessage = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  trigger.clear();

  Object.assign(window, {
    postMessage: mockPostMessage,
    addEventListener: (type: string, callback: (event: Event) => void) => {
      mockAddEventListener(type, callback);
      trigger.add(type, callback);
    },
    removeEventListener: (type: string, callback: (event: Event) => void) => {
      mockRemoveEventListener(type, callback);
      if (trigger.get(type) === callback) trigger.delete(type);
    },
    dispatchEvent: (event: Event) => {
      trigger.callback(event.type, event);
      return true;
    }
  });
});

it('Should use postMessage', () => {
  const { result } = renderHook(() => usePostMessage('*', vi.fn()));
  expect(result.current).toBeTypeOf('function');
});

it('Should use postMessage on server side', () => {
  const { result } = renderHookServer(() => usePostMessage('*', vi.fn()));
  expect(result.current).toBeTypeOf('function');
});

it('Should postMessage when handler is called', () => {
  const { result } = renderHook(() => usePostMessage('*', vi.fn()));

  act(() => {
    result.current({ data: 'test-message', origin: 'origin1' });
  });

  expect(mockPostMessage).toHaveBeenCalledOnce();
  expect(mockPostMessage).toHaveBeenCalledWith({ data: 'test-message', origin: 'origin1' }, '*');
});

it('Should filter by origin', () => {
  const callback = vi.fn();
  renderHook(() => usePostMessage('allowed-origin', callback));

  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', { data: 'test-message', origin: 'blocked-origin' })
    );
  });
  expect(callback).not.toHaveBeenCalled();

  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', { data: 'test-message', origin: 'allowed-origin' })
    );
  });

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(
    'test-message',
    expect.objectContaining({ data: 'test-message', origin: 'allowed-origin' })
  );
});

it('Should add and remove event listener on mount and unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => usePostMessage('*', callback));

  expect(mockAddEventListener).toHaveBeenCalledWith('message', expect.any(Function));

  unmount();

  expect(mockRemoveEventListener).toHaveBeenCalledWith('message', expect.any(Function));
});

it('Should filter by array of origins', () => {
  const callback = vi.fn();
  renderHook(() => usePostMessage(['origin1', 'origin2'], callback));

  act(() => {
    window.dispatchEvent(new MessageEvent('message', { data: 'm', origin: 'origin3' }));
  });
  expect(callback).not.toHaveBeenCalled();

  act(() => {
    window.dispatchEvent(new MessageEvent('message', { data: 'm', origin: 'origin2' }));
  });

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(
    'm',
    expect.objectContaining({ data: 'm', origin: 'origin2' })
  );
});

it('Should accept "*" inside array origins', () => {
  const callback = vi.fn();
  renderHook(() => usePostMessage(['origin1', '*'], callback));

  act(() => {
    window.dispatchEvent(new MessageEvent('message', { data: 'm', origin: 'other' }));
  });

  expect(callback).toHaveBeenCalledOnce();
});

it('Should post to each origin when origin is array', () => {
  const { result } = renderHook(() => usePostMessage(['a', 'b'], vi.fn()));

  act(() => {
    result.current('payload');
  });

  expect(mockPostMessage).toHaveBeenCalledTimes(2);
  expect(mockPostMessage).toHaveBeenCalledWith('payload', 'a');
  expect(mockPostMessage).toHaveBeenCalledWith('payload', 'b');
});
