import { act, renderHook } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { usePointerLock } from './usePointerLock';

const element = document.getElementById('target') as HTMLDivElement;
const createMouseEvent = () =>
  Object.defineProperty(new MouseEvent('mousedown'), 'currentTarget', {
    value: element,
    configurable: true
  });

beforeEach(() => {
  Object.defineProperty(document, 'pointerLockElement', {
    value: null,
    writable: true,
    configurable: true
  });

  document.exitPointerLock = vi.fn() as typeof document.exitPointerLock;
  element.requestPointerLock = vi.fn();
});

it('Should use pointer lock', () => {
  const { result } = renderHook(usePointerLock);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.element).toBeUndefined();
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should use pointer lock on server side', () => {
  const { result } = renderHookServer(usePointerLock);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.element).toBeUndefined();
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should use pointer lock for unsupported', () => {
  Object.defineProperty(document, 'exitPointerLock', {
    value: undefined,
    configurable: true
  });

  const { result } = renderHook(usePointerLock);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.element).toBeUndefined();
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should handle lock', () => {
  const { result } = renderHook(usePointerLock);

  act(() => {
    const value = result.current.lock(createMouseEvent() as never);

    expect(value).toBeTruthy();
  });

  expect(element.requestPointerLock).toHaveBeenCalledTimes(1);
  expect(result.current.element).toBe(element);
});

it('Should handle unlock', () => {
  const { result } = renderHook(usePointerLock);

  act(() => {
    result.current.lock(createMouseEvent() as never);
  });

  act(() => {
    const value = result.current.unlock();

    expect(value).toBeTruthy();
  });

  expect(document.exitPointerLock).toHaveBeenCalledTimes(1);
  expect(result.current.element).toBeUndefined();
});

it('Should react to pointer lock changes', () => {
  const { result } = renderHook(usePointerLock);

  act(() => {
    result.current.lock(createMouseEvent() as never);
  });

  act(() => {
    (document as Document & { pointerLockElement: Element | null }).pointerLockElement = element;
    document.dispatchEvent(new Event('pointerlockchange'));
  });

  expect(result.current.element).toBe(element);
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  const { unmount } = renderHook(usePointerLock);

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerlockchange', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerlockerror', expect.any(Function));
});
