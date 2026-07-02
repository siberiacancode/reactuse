import { act, renderHook } from '@testing-library/react';

import { useGeolocation } from '@/hooks/useGeolocation/useGeolocation';
import { renderHookServer } from '@/tests';

const mockNavigatorGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn()
};

beforeEach(() => {
  Object.defineProperty(globalThis.navigator, 'geolocation', {
    value: mockNavigatorGeolocation,
    configurable: true
  });
});

it('Should use geolocation', () => {
  const { result } = renderHook(useGeolocation);

  expect(result.current.value).toEqual({
    loading: true,
    error: null,
    timestamp: expect.any(Number),
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  });
  expect(result.current.watching).toBeTruthy();
  expect(result.current.get).toBeTypeOf('function');
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
});

it('Should use geolocation on server side', () => {
  const { result } = renderHookServer(useGeolocation);

  expect(result.current.value).toEqual({
    loading: true,
    error: null,
    timestamp: expect.any(Number),
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  });
  expect(result.current.watching).toBeFalsy();
  expect(result.current.get).toBeTypeOf('function');
  expect(result.current.start).toBeTypeOf('function');
  expect(result.current.stop).toBeTypeOf('function');
});

it('Should update state on successful geolocation retrieval', () => {
  const position = {
    coords: {
      latitude: 50,
      longitude: 14,
      altitude: 100,
      accuracy: 10,
      altitudeAccuracy: 5,
      heading: 90,
      speed: 10
    },
    timestamp: 123456789
  };

  mockNavigatorGeolocation.getCurrentPosition.mockImplementation((success) => success(position));
  mockNavigatorGeolocation.watchPosition.mockImplementation((success) => {
    success(position);
    return 1;
  });

  const { result } = renderHook(useGeolocation);

  expect(result.current.value).toEqual({
    loading: false,
    error: null,
    timestamp: position.timestamp,
    accuracy: position.coords.accuracy,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    altitude: position.coords.altitude,
    altitudeAccuracy: position.coords.altitudeAccuracy,
    heading: position.coords.heading,
    speed: position.coords.speed
  });
});

it('Should update state on geolocation error', () => {
  const error = {
    code: 1,
    message: 'User denied Geolocation'
  };

  mockNavigatorGeolocation.getCurrentPosition.mockImplementation((_, failure) => failure(error));
  mockNavigatorGeolocation.watchPosition.mockImplementation((_, failure) => {
    failure(error);
    return 1;
  });

  const { result } = renderHook(useGeolocation);

  expect(result.current.value).toEqual({
    loading: false,
    error,
    timestamp: expect.any(Number),
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  });
});

it('Should call onChange callback when geolocation changes', () => {
  const onChange = vi.fn();
  const position = {
    coords: {
      latitude: 50,
      longitude: 14,
      altitude: 100,
      accuracy: 10,
      altitudeAccuracy: 5,
      heading: 90,
      speed: 10
    },
    timestamp: 123456789
  };

  mockNavigatorGeolocation.watchPosition.mockImplementation((resolve) => {
    resolve(position);
    return 1;
  });

  renderHook(() => useGeolocation({ onChange }));

  expect(onChange).toHaveBeenCalledOnce();
  expect(onChange).toHaveBeenCalledWith(position);
});

it('Should call onError callback when geolocation error occurs', () => {
  const onError = vi.fn();
  const error = {
    code: 1,
    message: 'User denied'
  };

  mockNavigatorGeolocation.watchPosition.mockImplementation((_, reject) => {
    reject(error);
    return 1;
  });

  renderHook(() => useGeolocation({ onError }));

  expect(onError).toHaveBeenCalledOnce();
  expect(onError).toHaveBeenCalledWith(error);
});

it('Should get current position by action', () => {
  mockNavigatorGeolocation.getCurrentPosition.mockImplementation((success) =>
    success({
      coords: {
        latitude: 50,
        longitude: 14,
        altitude: 100,
        accuracy: 10,
        altitudeAccuracy: 5,
        heading: 90,
        speed: 10
      },
      timestamp: 123456789
    })
  );

  const { result } = renderHook(() => useGeolocation({ immediately: false }));

  expect(result.current.value.loading).toBeFalsy();

  act(result.current.get);

  expect(mockNavigatorGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
  expect(result.current.value).toEqual({
    loading: false,
    error: null,
    timestamp: 123456789,
    accuracy: 10,
    latitude: 50,
    longitude: 14,
    altitude: 100,
    altitudeAccuracy: 5,
    heading: 90,
    speed: 10
  });
});

it('Should start by actions', () => {
  mockNavigatorGeolocation.watchPosition.mockImplementation(() => 1);

  const { result } = renderHook(() => useGeolocation({ immediately: false }));

  expect(result.current.watching).toBeFalsy();

  act(() => {
    result.current.start();
  });

  expect(mockNavigatorGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
  expect(mockNavigatorGeolocation.watchPosition).toHaveBeenCalledOnce();
  expect(result.current.watching).toBeTruthy();
});

it('Should stop by actions', () => {
  mockNavigatorGeolocation.watchPosition.mockImplementation(() => 1);

  const { result } = renderHook(() => useGeolocation({ immediately: false }));

  expect(result.current.watching).toBeFalsy();

  act(() => {
    result.current.start();
  });

  expect(mockNavigatorGeolocation.getCurrentPosition).toHaveBeenCalledOnce();
  expect(mockNavigatorGeolocation.watchPosition).toHaveBeenCalledOnce();
  expect(result.current.watching).toBeTruthy();

  act(() => {
    result.current.stop();
  });

  expect(mockNavigatorGeolocation.clearWatch).toHaveBeenCalledWith(1);
  expect(result.current.watching).toBeFalsy();
});

it('Should cleanup on unmount', () => {
  mockNavigatorGeolocation.watchPosition.mockImplementation(() => 1);

  const { unmount } = renderHook(useGeolocation);

  unmount();

  expect(mockNavigatorGeolocation.clearWatch).toHaveBeenCalledOnce();
});
