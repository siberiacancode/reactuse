import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';

import { createEventEmitter } from './createEventEmitter';

interface TestEvents {
  'cart:updated': { total: number };
  'user:login': { id: string; timestamp: number };
}

let eventEmitter: ReturnType<typeof createEventEmitter<TestEvents>>;

beforeEach(() => {
  eventEmitter = createEventEmitter<TestEvents>();
});

it('Should create event emitter', () => {
  expect(eventEmitter.push).toBeTypeOf('function');
  expect(eventEmitter.subscribe).toBeTypeOf('function');
  expect(eventEmitter.unsubscribe).toBeTypeOf('function');
  expect(eventEmitter.useSubscribe).toBeTypeOf('function');
  expect(eventEmitter.useSubscribeEffect).toBeTypeOf('function');
  expect(eventEmitter.once).toBeTypeOf('function');
  expect(eventEmitter.reset).toBeTypeOf('function');
});

it('Should push events', () => {
  const callback = vi.fn();
  const testData = { id: '1', timestamp: Date.now() };

  eventEmitter.subscribe('user:login', callback);
  eventEmitter.push('user:login', testData);

  expect(callback).toHaveBeenCalledWith(testData);
});

it('Should return unsubscribe function', () => {
  const callback = vi.fn();
  const unsubscribe = eventEmitter.subscribe('user:login', callback);

  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });
  expect(callback).toHaveBeenCalledOnce();

  unsubscribe();

  eventEmitter.push('user:login', { id: '2', timestamp: Date.now() });
  expect(callback).toHaveBeenCalledOnce();
});

it('Should allow multiple listeners', () => {
  const firstCallback = vi.fn();
  const secondCallback = vi.fn();

  eventEmitter.subscribe('user:login', firstCallback);
  eventEmitter.subscribe('user:login', secondCallback);

  const data = { id: '1', timestamp: Date.now() };
  eventEmitter.push('user:login', data);

  expect(firstCallback).toHaveBeenCalledWith(data);
  expect(secondCallback).toHaveBeenCalledWith(data);
});

it('Should unsubscribe specific listener', () => {
  const callback = vi.fn();

  eventEmitter.subscribe('user:login', callback);

  const testData = { id: '1', timestamp: Date.now() };
  eventEmitter.push('user:login', testData);

  expect(callback).toHaveBeenCalledOnce();

  eventEmitter.unsubscribe('user:login', callback);

  eventEmitter.push('user:login', { id: '2', timestamp: Date.now() });

  expect(callback).toHaveBeenCalledOnce();
});

it('Should use subscribe hook', () => {
  const { result } = renderHook(() => eventEmitter.useSubscribe('user:login'));

  expect(result.current).toBeUndefined();
});

it('Should update state on event', () => {
  const data = { id: '1', timestamp: Date.now() };
  const { result } = renderHook(() => eventEmitter.useSubscribe('user:login'));

  act(() => eventEmitter.push('user:login', data));

  expect(result.current).toEqual(data);
});

it('Should call listener callback', () => {
  const data = { id: '1', timestamp: Date.now() };
  const callback = vi.fn();
  const { result } = renderHook(() => eventEmitter.useSubscribe('user:login', callback));

  act(() => eventEmitter.push('user:login', data));

  expect(result.current).toEqual(data);
  expect(callback).toHaveBeenCalledWith(data);
});

it('Should unsubscribe on unmount', () => {
  const callback = vi.fn();
  const { result, unmount } = renderHook(() => eventEmitter.useSubscribe('user:login', callback));

  const data = { id: '1', timestamp: Date.now() };

  act(() => eventEmitter.push('user:login', data));

  expect(result.current).toEqual(data);
  expect(callback).toHaveBeenCalledOnce();

  unmount();

  act(() => eventEmitter.push('user:login', { id: '2', timestamp: Date.now() }));

  expect(callback).toHaveBeenCalledOnce();
});

it('Should continue dispatch when listener throws', () => {
  const queueMicrotaskSpy = vi.spyOn(globalThis, 'queueMicrotask').mockImplementation(() => {});
  const throwingCallback = vi.fn(() => {
    throw new Error('listener error');
  });
  const callback = vi.fn();

  eventEmitter.subscribe('user:login', throwingCallback);
  eventEmitter.subscribe('user:login', callback);

  const data = { id: '1', timestamp: Date.now() };

  expect(() => eventEmitter.push('user:login', data)).not.toThrow();

  expect(throwingCallback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(data);
  expect(queueMicrotaskSpy).toHaveBeenCalledOnce();
});

it('Should report listener error asynchronously', () => {
  const queueMicrotaskSpy = vi.spyOn(globalThis, 'queueMicrotask').mockImplementation(() => {});
  const error = new Error('listener error');

  eventEmitter.subscribe('user:login', () => {
    throw error;
  });
  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });

  const [report] = queueMicrotaskSpy.mock.calls[0];

  expect(report).toThrow(error);
});

it('Should not deliver current event to listener subscribed during dispatch', () => {
  const lateCallback = vi.fn();

  eventEmitter.subscribe('user:login', () => eventEmitter.subscribe('user:login', lateCallback));

  const data = { id: '1', timestamp: Date.now() };
  eventEmitter.push('user:login', data);

  expect(lateCallback).not.toHaveBeenCalled();

  eventEmitter.push('user:login', data);

  expect(lateCallback).toHaveBeenCalledOnce();
});

it('Should deliver current event to listener unsubscribed during dispatch', () => {
  const callback = vi.fn();

  eventEmitter.subscribe('user:login', () => eventEmitter.unsubscribe('user:login', callback));
  eventEmitter.subscribe('user:login', callback);

  const data = { id: '1', timestamp: Date.now() };
  eventEmitter.push('user:login', data);

  expect(callback).toHaveBeenCalledWith(data);

  eventEmitter.push('user:login', { id: '2', timestamp: Date.now() });

  expect(callback).toHaveBeenCalledOnce();
});

it('Should call once listener one time', () => {
  const callback = vi.fn();
  const data = { id: '1', timestamp: Date.now() };

  eventEmitter.once('user:login', callback);

  eventEmitter.push('user:login', data);
  eventEmitter.push('user:login', { id: '2', timestamp: Date.now() });

  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(data);
});

it('Should unsubscribe once listener by returned function', () => {
  const callback = vi.fn();
  const unsubscribe = eventEmitter.once('user:login', callback);

  unsubscribe();

  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });

  expect(callback).not.toHaveBeenCalled();
});

it('Should unsubscribe once listener by original reference', () => {
  const callback = vi.fn();

  eventEmitter.once('user:login', callback);
  eventEmitter.unsubscribe('user:login', callback);

  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });

  expect(callback).not.toHaveBeenCalled();
});

it('Should keep once listener unsubscribed when it throws', () => {
  vi.spyOn(globalThis, 'queueMicrotask').mockImplementation(() => {});
  const callback = vi.fn(() => {
    throw new Error('listener error');
  });

  eventEmitter.once('user:login', callback);

  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });
  eventEmitter.push('user:login', { id: '2', timestamp: Date.now() });

  expect(callback).toHaveBeenCalledOnce();
});

it('Should reset listeners for specific event', () => {
  const loginCallback = vi.fn();
  const cartCallback = vi.fn();

  eventEmitter.subscribe('user:login', loginCallback);
  eventEmitter.subscribe('cart:updated', cartCallback);

  eventEmitter.reset('user:login');

  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });
  eventEmitter.push('cart:updated', { total: 100 });

  expect(loginCallback).not.toHaveBeenCalled();
  expect(cartCallback).toHaveBeenCalledOnce();
});

it('Should reset all listeners when called without arguments', () => {
  const loginCallback = vi.fn();
  const cartCallback = vi.fn();

  eventEmitter.subscribe('user:login', loginCallback);
  eventEmitter.subscribe('cart:updated', cartCallback);

  eventEmitter.reset();

  eventEmitter.push('user:login', { id: '1', timestamp: Date.now() });
  eventEmitter.push('cart:updated', { total: 100 });

  expect(loginCallback).not.toHaveBeenCalled();
  expect(cartCallback).not.toHaveBeenCalled();
});

it('Should reset only falsy event key', () => {
  const emitter = createEventEmitter<{ '': string; keep: string }>();
  const emptyKeyCallback = vi.fn();
  const keepCallback = vi.fn();

  emitter.subscribe('', emptyKeyCallback);
  emitter.subscribe('keep', keepCallback);

  emitter.reset('');

  emitter.push('', 'first');
  emitter.push('keep', 'second');

  expect(emptyKeyCallback).not.toHaveBeenCalled();
  expect(keepCallback).toHaveBeenCalledWith('second');
});

it('Should use subscribe effect hook', () => {
  const callback = vi.fn();
  const data = { id: '1', timestamp: Date.now() };

  renderHook(() => eventEmitter.useSubscribeEffect('user:login', callback));

  act(() => eventEmitter.push('user:login', data));

  expect(callback).toHaveBeenCalledWith(data);
});

it('Should not rerender on subscribe effect hook', () => {
  const callback = vi.fn();
  const renderCallback = vi.fn();

  renderHook(() => {
    renderCallback();
    eventEmitter.useSubscribeEffect('user:login', callback);
  });

  const renderCount = renderCallback.mock.calls.length;

  act(() => eventEmitter.push('user:login', { id: '1', timestamp: Date.now() }));

  expect(callback).toHaveBeenCalledOnce();
  expect(renderCallback).toHaveBeenCalledTimes(renderCount);
});

it('Should unsubscribe effect hook on unmount', () => {
  const callback = vi.fn();
  const { unmount } = renderHook(() => eventEmitter.useSubscribeEffect('user:login', callback));

  act(() => eventEmitter.push('user:login', { id: '1', timestamp: Date.now() }));

  expect(callback).toHaveBeenCalledOnce();

  unmount();

  act(() => eventEmitter.push('user:login', { id: '2', timestamp: Date.now() }));

  expect(callback).toHaveBeenCalledOnce();
});
