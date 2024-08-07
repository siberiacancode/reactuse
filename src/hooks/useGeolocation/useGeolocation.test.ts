import { renderHook } from '@testing-library/react';

import { useGeolocation } from '@/hooks/useGeolocation/useGeolocation';

const geolocationPreset = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn()
};

beforeEach(() => {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocationPreset
  });
});

it('should return default state initially', () => {
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

it('should update state on successful geolocation retrieval', () => {
  const mockPosition = {
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

  geolocationPreset.getCurrentPosition.mockImplementation((success) => success(mockPosition));
  geolocationPreset.watchPosition.mockImplementation((success) => success(mockPosition));

  const { result } = renderHook(useGeolocation);

  expect(result.current).toEqual({
    loading: false,
    error: null,
    timestamp: mockPosition.timestamp,
    accuracy: mockPosition.coords.accuracy,
    latitude: mockPosition.coords.latitude,
    longitude: mockPosition.coords.longitude,
    altitude: mockPosition.coords.altitude,
    altitudeAccuracy: mockPosition.coords.altitudeAccuracy,
    heading: mockPosition.coords.heading,
    speed: mockPosition.coords.speed
  });
});

it('should update state on geolocation error', () => {
  const mockError = {
    code: 1,
    message: 'User denied Geolocation'
  };

  geolocationPreset.getCurrentPosition.mockImplementation((_, error) => error(mockError));
  geolocationPreset.watchPosition.mockImplementation((_, error) => error(mockError));

  const { result } = renderHook(useGeolocation);

  expect(result.current).toEqual({
    loading: false,
    error: mockError,
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

it('should clear watch position on unmount', () => {
  const watchId = 1;
  geolocationPreset.watchPosition.mockReturnValue(watchId);

  const { unmount } = renderHook(useGeolocation);

  unmount();

  expect(geolocationPreset.clearWatch).toHaveBeenCalledWith(watchId);
});
