import { renderHook } from '@testing-library/react';

import { useGeolocation } from '@/hooks/useGeolocation/useGeolocation';
import { renderHookServer } from '@/tests';

const mockNavigatorGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn()
};

beforeEach(() => {
  Object.defineProperty(globalThis.navigator, 'geolocation', {
    value: mockNavigatorGeolocation
  });
});

it('Should use geolocation', () => {
  const { result } = renderHook(useGeolocation);

  expect(result.current).toEqual({
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
});

it('Should use geolocation on server side', () => {
  const { result } = renderHookServer(useGeolocation);

  expect(result.current).toEqual({
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
  mockNavigatorGeolocation.watchPosition.mockImplementation((success) => success(position));

  const { result } = renderHook(useGeolocation);

  expect(result.current).toEqual({
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
  mockNavigatorGeolocation.watchPosition.mockImplementation((_, failure) => failure(error));

  const { result } = renderHook(useGeolocation);

  expect(result.current).toEqual({
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

  mockNavigatorGeolocation.watchPosition.mockImplementation((success) => success(position));

  renderHook(() => useGeolocation({ onChange }));

  expect(onChange).toHaveBeenCalledOnce();
  expect(onChange).toHaveBeenCalledWith(position);
});

it('Should call onError callback when geolocation error occurs', () => {
  const onError = vi.fn();
  const error = {
    code: 1,
    message: 'User denied Geolocation'
  };

  mockNavigatorGeolocation.watchPosition.mockImplementation((_, failure) => failure(error));

  renderHook(() => useGeolocation({ onError }));

  expect(onError).toHaveBeenCalledOnce();
  expect(onError).toHaveBeenCalledWith(error);
});

it('Should cleanup on unmount', () => {
  const { unmount } = renderHook(useGeolocation);

  unmount();

  expect(mockNavigatorGeolocation.clearWatch).toHaveBeenCalledOnce();
});
