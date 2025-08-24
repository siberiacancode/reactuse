import { act, renderHook } from '@testing-library/react';

import type { OrientationLockType } from './useOrientation';

import { useOrientation } from './useOrientation';

// Create mocks for ScreenOrientation API
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

// Mock for window.screen.orientation
let mockOrientation: MockScreenOrientation;

beforeEach(() => {
  // Reset mocks before each test
  mockOrientation = createMockScreenOrientation();

  // Create complete mock for window.screen object
  Object.defineProperty(window, 'screen', {
    value: {
      orientation: mockOrientation
    },
    writable: true,
    configurable: true
  });

  vi.clearAllMocks();
});

afterEach(() => {
  // Clear all event listeners
  window.removeEventListener('orientationchange', expect.any(Function));
});

it('Should return correct initial state when orientation API is supported', () => {
  const { result } = renderHook(() => useOrientation());

  expect(result.current.supported).toBe(true);
  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: 'portrait-primary'
  });
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should return correct initial state when orientation API is not supported', () => {
  // Remove orientation API support
  Object.defineProperty(window, 'screen', {
    value: {},
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useOrientation());

  expect(result.current.supported).toBe(false);
  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: undefined
  });
  expect(result.current.lock).toBeTypeOf('function');
  expect(result.current.unlock).toBeTypeOf('function');
});

it('Should handle different initial orientation values', () => {
  mockOrientation.angle = 90;
  mockOrientation.type = 'landscape-primary';

  const { result } = renderHook(() => useOrientation());

  expect(result.current.value).toEqual({
    angle: 90,
    orientationType: 'landscape-primary'
  });
});

it('Should update state when orientationchange event is fired', () => {
  const { result } = renderHook(() => useOrientation());

  // Initial state
  expect(result.current.value).toEqual({
    angle: 0,
    orientationType: 'portrait-primary'
  });

  // Simulate orientation change
  act(() => {
    mockOrientation.angle = 90;
    mockOrientation.type = 'landscape-primary';
    window.dispatchEvent(new Event('orientationchange'));
  });

  expect(result.current.value).toEqual({
    angle: 90,
    orientationType: 'landscape-primary'
  });
});

it('Should handle multiple orientation changes', () => {
  const { result } = renderHook(() => useOrientation());

  // First change
  act(() => {
    mockOrientation.angle = 90;
    mockOrientation.type = 'landscape-primary';
    window.dispatchEvent(new Event('orientationchange'));
  });

  expect(result.current.value).toEqual({
    angle: 90,
    orientationType: 'landscape-primary'
  });

  // Second change
  act(() => {
    mockOrientation.angle = 270;
    mockOrientation.type = 'landscape-secondary';
    window.dispatchEvent(new Event('orientationchange'));
  });

  expect(result.current.value).toEqual({
    angle: 270,
    orientationType: 'landscape-secondary'
  });
});

it('Should not add event listener when orientation API is not supported', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

  // Remove orientation API support
  Object.defineProperty(window, 'screen', {
    value: {},
    writable: true,
    configurable: true
  });

  renderHook(() => useOrientation());

  expect(addEventListenerSpy).not.toHaveBeenCalledWith('orientationchange', expect.any(Function));
});

it('Should call lock function when lock method is called', () => {
  const { result } = renderHook(() => useOrientation());

  act(() => {
    result.current.lock('landscape-primary');
  });

  expect(mockOrientation.lock).toHaveBeenCalledWith('landscape-primary');
});

it('Should call unlock function when unlock method is called', () => {
  const { result } = renderHook(() => useOrientation());

  act(() => {
    result.current.unlock();
  });

  expect(mockOrientation.unlock).toHaveBeenCalled();
});

it('Should not call lock when orientation API is not supported', () => {
  // Remove orientation API support
  Object.defineProperty(window, 'screen', {
    value: {},
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useOrientation());

  act(() => {
    result.current.lock('landscape-primary');
  });

  // lock should not be called since API is not supported
  expect(mockOrientation.lock).not.toHaveBeenCalled();
});

it('Should not call unlock when orientation API is not supported', () => {
  // Remove orientation API support
  Object.defineProperty(window, 'screen', {
    value: {},
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useOrientation());

  act(() => {
    result.current.unlock();
  });

  // unlock should not be called since API is not supported
  expect(mockOrientation.unlock).not.toHaveBeenCalled();
});

it('Should not call lock when lock function is not available', () => {
  // Create orientation without lock method
  Object.defineProperty(window, 'screen', {
    value: {
      orientation: {
        angle: 0,
        type: 'portrait-primary'
        // lock method is missing
      }
    },
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useOrientation());

  expect(() => {
    act(() => {
      result.current.lock('landscape-primary');
    });
  }).not.toThrow();

  expect(result.current.supported).toBe(true);
});

it('Should not call unlock when unlock function is not available', () => {
  // Create orientation without unlock method
  Object.defineProperty(window, 'screen', {
    value: {
      orientation: {
        angle: 0,
        type: 'portrait-primary'
        // unlock method is missing
      }
    },
    writable: true,
    configurable: true
  });

  const { result } = renderHook(() => useOrientation());

  expect(() => {
    act(() => {
      result.current.unlock();
    });
  }).not.toThrow();

  expect(result.current.supported).toBe(true);
});

it('Should clean up event listener on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

  const { unmount } = renderHook(() => useOrientation());

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
});

it('Should handle all orientation lock types', () => {
  const { result } = renderHook(() => useOrientation());

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
    act(() => {
      result.current.lock(orientation);
    });

    expect(mockOrientation.lock).toHaveBeenCalledWith(orientation);
  });

  expect(mockOrientation.lock).toHaveBeenCalledTimes(orientationTypes.length);
});
