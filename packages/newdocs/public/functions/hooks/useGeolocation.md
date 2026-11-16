---
title: useGeolocation
description: Hook that returns the current geolocation
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783015681000
---

# useGeolocation

Hook that returns the current geolocation

## Demo

```tsx
import { useCopy, useGeolocation } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon, MapPinIcon } from 'lucide-react';

const FALLBACK_COORDINATES = { latitude: 56.47414476814171, longitude: 84.95003125501695 };

const getMapEmbedUrl = (latitude: number, longitude: number) =>
  `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

const formatCoordinates = (latitude: number, longitude: number) =>
  `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

const Demo = () => {
  const geolocation = useGeolocation();
  const { copy, copied } = useCopy();

  const hasLocation =
    !geolocation.value.loading &&
    !geolocation.value.error &&
    geolocation.value.latitude !== null &&
    geolocation.value.longitude !== null;

  const latitude = hasLocation ? geolocation.value.latitude! : FALLBACK_COORDINATES.latitude;
  const longitude = hasLocation ? geolocation.value.longitude! : FALLBACK_COORDINATES.longitude;

  return (
    <section className='flex w-full max-w-xl flex-col p-4'>
      <div className='bg-card relative h-[360px] overflow-hidden rounded-2xl shadow-sm'>
        <iframe
          allow='geolocation'
          className='size-full border-0'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          src={getMapEmbedUrl(latitude, longitude)}
          title='Map'
        />

        <div className='absolute top-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 py-1.5 pr-1.5 pl-3 shadow-lg backdrop-blur-md'>
          {hasLocation && (
            <>
              <span className='font-mono text-xs font-semibold text-white tabular-nums'>
                {formatCoordinates(latitude, longitude)}
              </span>
              <button
                aria-label='Copy coordinates'
                data-size='icon-sm'
                data-variant='unstyled'
                type='button'
                onClick={() => copy(formatCoordinates(latitude, longitude))}
              >
                {copied ? (
                  <CheckIcon className='size-3.5 text-green-400' />
                ) : (
                  <CopyIcon className='size-3.5 text-white' />
                )}
              </button>
            </>
          )}

          {!hasLocation && (
            <>
              <MapPinIcon className='size-3.5 text-white/70' />
              <span className='pr-2 text-[10px] tracking-[0.15em] text-white/90 uppercase'>
                {geolocation.value.error ? 'Location unavailable' : 'Locating...'}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useGeolocation
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use geolocation value type */
export interface UseGeolocationValue {
  /** The accuracy of the last position update */
  accuracy: number | null;
  /** The altitude of the last position update */
  altitude: number | null;
  /** The altitude accuracy of the last position update */
  altitudeAccuracy: number | null;
  /** The error of the last position update */
  error: GeolocationPositionError | null;
  /** The heading of the last position update */
  heading: number | null;
  /** The latitude of the last position update */
  latitude: number | null;
  /** The loading state */
  loading: boolean;
  /** The longitude of the last position update */
  longitude: number | null;
  /** The speed of the last position update */
  speed: number | null;
  /** The timestamp of the last position update */
  timestamp: number | null;
}

/** The use geolocation return type */
export interface UseGeolocationReturn {
  /** The current geolocation state */
  value: UseGeolocationValue;
  /** Whether the watch is currently active */
  watching: boolean;
  /** Get the current position once (without starting a watch) */
  get: () => void;
  /** Start watching the position */
  start: () => void;
  /** Stop watching the position */
  stop: () => void;
}

/** The use geolocation callback type */
export type UseGeolocationCallback = (position: GeolocationPosition) => void;

/** The use geolocation options type */
export interface UseGeolocationOptions extends PositionOptions {
  /** Whether to start watching immediately on mount (default: true) */
  immediately?: boolean;
  /** The callback function to be invoked when the geolocation changes */
  onChange?: UseGeolocationCallback;
  /** The callback function to be invoked when geolocation errors */
  onError?: (error: GeolocationPositionError) => void;
}

export interface UseGeolocation {
  (
    callback?: UseGeolocationCallback,
    options?: PositionOptions & { immediately?: boolean }
  ): UseGeolocationReturn;

  (options?: UseGeolocationOptions): UseGeolocationReturn;
}

/**
 * @name useGeolocation
 * @description - Hook that returns the current geolocation
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.geolocation https://developer.mozilla.org/en-US/docs/Web/API/Navigator/geolocation
 *
 * @overload
 * @param {UseGeolocationCallback} [callback] The callback function to be invoked when geolocation changes
 * @param {boolean} [params.immediately=true] Start watching immediately
 * @param {boolean} [params.enableHighAccuracy] Enable high accuracy
 * @param {number} [params.maximumAge] Maximum age
 * @param {number} [params.timeout] Timeout
 * @returns {UseGeolocationReturn} An object containing the geolocation state and controls
 *
 * @example
 * const { value, start, stop, watching } = useGeolocation(() => console.log('callback'));
 *
 * @overload
 * @param {UseGeolocationOptions} [options] Configuration options
 * @param {boolean} [options.immediately=true] Start watching immediately on mount
 * @param {(position: GeolocationPosition) => void} [options.onChange] The callback function to be invoked when geolocation changes
 * @param {(error: GeolocationPositionError) => void} [options.onError] The callback function to be invoked on geolocation error
 * @param {boolean} [options.enableHighAccuracy] Enable high accuracy
 * @param {number} [options.maximumAge] Maximum age
 * @param {number} [options.timeout] Timeout
 * @returns {UseGeolocationReturn} An object containing the geolocation state and controls
 *
 * @example
 * const { value, start, stop, watching } = useGeolocation({ immediately: false });
 */
export const useGeolocation = ((...params: any[]) => {
  const options = (
    typeof params[0] === 'function' ? { ...params[1], onChange: params[0] } : params[0]
  ) as UseGeolocationOptions | undefined;

  const immediately = options?.immediately ?? true;

  const [value, setValue] = useState<UseGeolocationValue>({
    loading: immediately,
    error: null,
    timestamp: Date.now(),
    accuracy: 0,
    latitude: Number.POSITIVE_INFINITY,
    longitude: Number.POSITIVE_INFINITY,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  });
  const [watching, setWatching] = useState(false);

  const optionsRef = useRef(options);
  optionsRef.current = options;
  const watchIdRef = useRef<number | null>(null);

  const onEvent = (position: GeolocationPosition) => {
    const { coords, timestamp } = position;

    setValue((currentValue) => ({
      ...currentValue,
      loading: false,
      error: null,
      timestamp,
      latitude: coords.latitude,
      longitude: coords.longitude,
      altitude: coords.altitude,
      accuracy: coords.accuracy,
      altitudeAccuracy: coords.altitudeAccuracy,
      heading: coords.heading,
      speed: coords.speed
    }));

    optionsRef.current?.onChange?.(position);
  };

  const onError = (error: GeolocationPositionError) => {
    setValue((currentValue) => ({
      ...currentValue,
      loading: false,
      error
    }));

    optionsRef.current?.onError?.(error);
  };

  const get = () => {
    setValue((currentValue) => ({ ...currentValue, loading: true }));
    navigator.geolocation.getCurrentPosition(onEvent, onError, optionsRef.current);
  };

  const start = () => {
    if (watchIdRef.current !== null) return;

    setValue((currentValue) => ({ ...currentValue, loading: true }));
    navigator.geolocation.getCurrentPosition(onEvent, onError, optionsRef.current);
    watchIdRef.current = navigator.geolocation.watchPosition(onEvent, onError, optionsRef.current);
    setWatching(true);
  };

  const stop = () => {
    if (!watchIdRef.current) return;
    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;

    setWatching(false);
  };

  useEffect(() => {
    if (!immediately) return;
    start();
    return () => {
      stop();
    };
  }, [options?.enableHighAccuracy, options?.maximumAge, options?.timeout, immediately]);

  return { value, watching, start, stop, get };
}) as UseGeolocation;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, start, stop, watching } = useGeolocation(() => console.log('callback'));
// or
const { value, start, stop, watching } = useGeolocation({ immediately: false });
```

## Type Declarations

```tsx
export interface UseGeolocationValue {
  /** The accuracy of the last position update */
  accuracy: number | null;
  /** The altitude of the last position update */
  altitude: number | null;
  /** The altitude accuracy of the last position update */
  altitudeAccuracy: number | null;
  /** The error of the last position update */
  error: GeolocationPositionError | null;
  /** The heading of the last position update */
  heading: number | null;
  /** The latitude of the last position update */
  latitude: number | null;
  /** The loading state */
  loading: boolean;
  /** The longitude of the last position update */
  longitude: number | null;
  /** The speed of the last position update */
  speed: number | null;
  /** The timestamp of the last position update */
  timestamp: number | null;
}

export interface UseGeolocationReturn {
  /** The current geolocation state */
  value: UseGeolocationValue;
  /** Whether the watch is currently active */
  watching: boolean;
  /** Get the current position once (without starting a watch) */
  get: () => void;
  /** Start watching the position */
  start: () => void;
  /** Stop watching the position */
  stop: () => void;
}

export type UseGeolocationCallback = (position: GeolocationPosition) => void;

export interface UseGeolocationOptions extends PositionOptions {
  /** Whether to start watching immediately on mount (default: true) */
  immediately?: boolean;
  /** The callback function to be invoked when the geolocation changes */
  onChange?: UseGeolocationCallback;
  /** The callback function to be invoked when geolocation errors */
  onError?: (error: GeolocationPositionError) => void;
}

export interface UseGeolocation {
  (
    callback?: UseGeolocationCallback,
    options?: PositionOptions & { immediately?: boolean }
  ): UseGeolocationReturn;

  (options?: UseGeolocationOptions): UseGeolocationReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseGeolocationCallback` | - | The callback function to be invoked when geolocation changes |
| params.immediately | `boolean` | true | Start watching immediately |
| params.enableHighAccuracy | `boolean` | - | Enable high accuracy |
| params.maximumAge | `number` | - | Maximum age |
| params.timeout | `number` | - | Timeout |

#### Returns

`UseGeolocationReturn` - An object containing the geolocation state and controls

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseGeolocationOptions` | - | Configuration options |
| options.immediately | `boolean` | true | Start watching immediately on mount |
| options.onChange | `(position: GeolocationPosition) => void` | - | The callback function to be invoked when geolocation changes |
| options.onError | `(error: GeolocationPositionError) => void` | - | The callback function to be invoked on geolocation error |
| options.enableHighAccuracy | `boolean` | - | Enable high accuracy |
| options.maximumAge | `number` | - | Maximum age |
| options.timeout | `number` | - | Timeout |

#### Returns

`UseGeolocationReturn` - An object containing the geolocation state and controls