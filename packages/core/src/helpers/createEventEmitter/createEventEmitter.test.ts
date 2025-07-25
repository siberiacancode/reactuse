import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';

import { createEventEmitter } from './createEventEmitter';

interface TestEvents {
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
