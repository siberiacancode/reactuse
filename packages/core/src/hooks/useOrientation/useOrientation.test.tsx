import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import type { OrientationLockType } from './useOrientation';

import { useOrientation } from './useOrientation';

interface MockScreenOrientation {
  angle: number;
  lock: ReturnType<typeof vi.fn>;
  type: OrientationType;
  unlock: ReturnType<typeof vi.fn>;
}

const createMockScreenOrientation = (
  angle: number = 0,
  type: OrientationType = 'portrait-primary'
): MockScreenOrientation => ({
  angle,
  type,
  lock: vi.fn(),
  unlock: vi.fn()
});

beforeEach(() => {
  Object.defineProperty(window, 'screen', {
    value: { orientation: createMockScreenOrientation() },
    writable: true,
    configurable: true
  });
});

afterEach(vi.clearAllMocks);

it('Should use orientation', () => {
  const { result } = renderHook(useOrientation);

  expect(result.current.supported).toBeTruthy();
  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: 'portrait-primary'
  });
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should use orientation on server side', () => {
  const { result } = renderHookServer(useOrientation);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: undefined
  });
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should use orientation for unsupported', () => {
  Object.defineProperty(window, 'screen', {
    value: {},
    writable: true,
    configurable: true
  });

  const { result } = renderHook(useOrientation);

  expect(result.current.supported).toBeFalsy();
  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: undefined
  });
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should handle different initial orientation values', () => {
  Object.defineProperty(window, 'screen', {
    value: {
      orientation: createMockScreenOrientation(90, 'landscape-primary')
    },
    writable: true,
    configurable: true
  });

  const { result } = renderHook(useOrientation);

  expect(result.current.value).toEqual({
    angle: 90,
    orientationType: 'landscape-primary'
  });
});

it('Should update state when orientationchange event is fired', () => {
  const { result } = renderHook(useOrientation);

  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: 'portrait-primary'
  });

  act(() => {
    Object.defineProperty(window.screen, 'orientation', {
      value: createMockScreenOrientation(90, 'landscape-primary'),
      writable: true,
      configurable: true
    });
    window.dispatchEvent(new Event('orientationchange'));
  });

  expect(result.current.value).toEqual({
    angle: 90,
    orientationType: 'landscape-primary'
  });
});

it('Should call lock function when lock method is called', () => {
  const { result } = renderHook(useOrientation);

  act(() => result.current.lock('landscape-primary'));

  expect(window.screen.orientation.lock).toHaveBeenCalledWith('landscape-primary');
});

it('Should call unlock function when unlock method is called', () => {
  const { result } = renderHook(useOrientation);

  act(result.current.unlock);

  expect(window.screen.orientation.unlock).toHaveBeenCalled();
});

it('Should handle all orientation lock types', () => {
  const { result } = renderHook(useOrientation);

  const orientationTypes: OrientationLockType[] = [
    'any',
    'landscape-primary',
    'landscape-secondary',
    'landscape',
    'natural',
    'portrait-primary',
    'portrait-secondary',
    'portrait'
  ];

  orientationTypes.forEach((orientation) => {
    act(() => result.current.lock(orientation));

    expect(window.screen.orientation.lock).toHaveBeenCalledWith(orientation);
  });

  expect(window.screen.orientation.lock).toHaveBeenCalledTimes(orientationTypes.length);
});

it('Should cleanup on unmount', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(useOrientation);

  expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
});
