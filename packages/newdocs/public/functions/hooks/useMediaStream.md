---
title: useMediaStream
description: Hook that provides reactive access to a `mediaDevices.getUserMedia` stream
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783064047000
---

# useMediaStream

Hook that provides reactive access to a `mediaDevices.getUserMedia` stream

## Demo

```tsx
import {
  useClickOutside,
  useDeviceList,
  useDisclosure,
  useMediaStream
} from '@siberiacancode/reactuse';
import {
  CameraIcon,
  CameraOffIcon,
  CheckIcon,
  ChevronDownIcon,
  LoaderCircleIcon,
  PhoneOffIcon
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

  const dropdownMenu = useDisclosure();
  const dropdownRef = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());

  const mediaStream = useMediaStream({
    immediately: false,
    constraints: {
      video: true,
      audio: false
    }
  });

  const deviceList = useDeviceList();

  const onCameraSelect = async (id: string) => {
    setDeviceId(id);
    dropdownMenu.close();

    const constraints: MediaStreamConstraints = {
      video: { deviceId: { exact: id } },
      audio: false
    };

    if (mediaStream.active) await mediaStream.start(constraints);
  };

  const onCameraClick = async () => {
    if (mediaStream.active) return mediaStream.stop();
    const constraints: MediaStreamConstraints = {
      video: { deviceId: { exact: deviceId } },
      audio: false
    };

    const stream = await mediaStream.start(constraints);
    if (!stream) return;
    const [videoTrack] = stream.getVideoTracks();
    const activeDeviceId = videoTrack.getSettings().deviceId;
    setDeviceId(activeDeviceId);
    deviceList.update();
  };

  if (!mediaStream.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  const activeCamera = deviceList.videoInputs.find((camera) => camera.deviceId === deviceId);

  return (
    <section className='flex w-[350px] flex-col gap-3 p-4'>
      <div className='bg-card/70 relative flex flex-col rounded-xl'>
        <div className='relative flex aspect-[16/9] items-center justify-center overflow-hidden p-2'>
          <div className='relative size-full overflow-hidden rounded-lg'>
            <video
              autoPlay
              muted
              playsInline
              ref={mediaStream.ref}
              className={cn(
                'absolute inset-0 size-full object-cover',
                !mediaStream.active && 'hidden'
              )}
            />

            {!mediaStream.active && (
              <div className='bg-card absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg p-4 text-center'>
                {mediaStream.loading ? (
                  <LoaderCircleIcon className='text-foreground size-8 animate-spin' />
                ) : (
                  <div className='flex flex-col items-center gap-3'>
                    <div
                      className='bg-muted text-foreground size-14'
                      data-size='lg'
                      data-slot='avatar'
                    >
                      <span data-slot='avatar-fallback'>YN</span>
                    </div>
                    <span className='text-foreground text-sm font-medium'>Your Name</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between gap-2 p-3'>
          <div className='flex items-center gap-2'>
            <button
              aria-label={mediaStream.active ? 'Turn camera off' : 'Turn camera on'}
              data-variant='secondary'
              disabled={!deviceList.videoInputs.length}
              type='button'
              onClick={onCameraClick}
            >
              {mediaStream.active ? (
                <CameraIcon className='size-4' />
              ) : (
                <CameraOffIcon className='size-4' />
              )}
            </button>

            <div ref={dropdownRef} className='relative'>
              <button
                aria-label='Select camera'
                className='flex w-44 items-center gap-2'
                data-variant='secondary'
                type='button'
                onClick={() => dropdownMenu.toggle()}
              >
                <span className='min-w-0 flex-1 truncate text-left text-xs'>
                  {activeCamera?.label || 'Default camera'}
                </span>
                <ChevronDownIcon className='size-4' />
              </button>

              {dropdownMenu.opened && (
                <div
                  className='absolute bottom-full left-0 z-20 mb-2 w-56'
                  data-slot='dropdown-menu-content'
                >
                  {!deviceList.videoInputs.length && (
                    <div data-slot='dropdown-menu-item'>No cameras found</div>
                  )}
                  {deviceList.videoInputs.map((camera) => (
                    <div
                      key={camera.deviceId}
                      data-slot='dropdown-menu-item'
                      onClick={() => onCameraSelect(camera.deviceId)}
                    >
                      <CameraIcon className='size-4' />
                      <span className='truncate'>
                        {camera.label || `Camera ${camera.deviceId.slice(0, 6)}`}
                      </span>
                      {camera.deviceId === deviceId && (
                        <CheckIcon className='size-4' data-slot='dropdown-menu-shortcut' />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button data-variant='destructive' type='button'>
            <PhoneOffIcon className='size-4' />
            End
          </button>
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
npx useverse@latest add useMediaStream
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use media stream options type */
export interface UseMediaStreamOptions {
  /** Default constraints to be passed to `getUserMedia` on the first request */
  constraints?: MediaStreamConstraints;
  /** Whether the stream should be requested immediately */
  immediately?: boolean;
  /** The callback fired when requesting the stream fails */
  onError?: (error: Error) => void;
  /** The callback fired once the stream was successfully obtained */
  onStart?: (stream: MediaStream) => void;
  /** The callback fired when the stream is stopped */
  onStop?: (stream?: MediaStream) => void;
}

/** The use media stream return type */
export interface UseMediaStreamReturn {
  /** Whether a stream is currently active */
  active: boolean;
  /** Whether a stream is currently being requested */
  loading: boolean;
  /** The current media stream, if any */
  stream?: MediaStream;
  /** Whether `mediaDevices.getUserMedia` is supported by the browser */
  supported: boolean;
  /** Apply constraints to the live media tracks without recreating the stream */
  apply: (constraints: MediaStreamConstraints) => Promise<boolean>;
  /** Stop the current stream and request a new one with the current constraints */
  restart: () => Promise<MediaStream | undefined>;
  /** Request and start the media stream */
  start: (constraints?: MediaStreamConstraints) => Promise<MediaStream | undefined>;
  /** Stop all tracks of the current media stream */
  stop: () => void;
}

export interface UseMediaStream {
  (target: HookTarget, options?: UseMediaStreamOptions): UseMediaStreamReturn;

  (options?: UseMediaStreamOptions): UseMediaStreamReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}

/**
 * @name useMediaStream
 * @description - Hook that provides reactive access to a `mediaDevices.getUserMedia` stream
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.mediaDevices.getUserMedia https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 *
 * @overload
 * @param {HookTarget} target The target video element the stream will be attached to
 * @param {boolean} [options.immediately=false] Whether the stream should be requested immediately
 * @param {MediaStreamConstraints} [options.constraints] Default constraints passed to `getUserMedia`
 * @param {(stream: MediaStream) => void} [options.onStart] Callback fired when the stream starts
 * @param {(stream?: MediaStream) => void} [options.onStop] Callback fired when the stream stops
 * @param {(error: Error) => void} [options.onError] Callback fired when the request fails
 * @returns {UseMediaStreamReturn} An object containing the media stream state and controls
 *
 * @example
 * const { stream, start, apply, stop } = useMediaStream(videoRef);
 *
 * @overload
 * @param {boolean} [options.immediately=false] Whether the stream should be requested immediately
 * @param {MediaStreamConstraints} [options.constraints] Default constraints passed to `getUserMedia`
 * @param {(stream: MediaStream) => void} [options.onStart] Callback fired when the stream starts
 * @param {(stream?: MediaStream) => void} [options.onStop] Callback fired when the stream stops
 * @param {(error: Error) => void} [options.onError] Callback fired when the request fails
 * @returns {UseMediaStreamReturn & { ref: StateRef<HTMLVideoElement> }} An object containing the media stream state, controls and ref
 *
 * @example
 * const { ref, stream, start, apply, stop } = useMediaStream<HTMLVideoElement>();
 */
export const useMediaStream = ((...params: any[]) => {
  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices &&
    !!navigator.mediaDevices.getUserMedia;

  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const options = ((target ? params[1] : params[0]) as UseMediaStreamOptions) ?? {};
  const immediately = options?.immediately ?? false;

  const [active, setActive] = useState(options.immediately ?? false);
  const [loading, setLoading] = useState(false);

  const internalRef = useRefState<HTMLVideoElement>();
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const streamRef = useRef<MediaStream>(undefined);
  const constraintsRef = useRef<MediaStreamConstraints>(
    options.constraints ?? {
      video: true,
      audio: true
    }
  );

  const elementRef = useRef<HTMLMediaElement | null>(null);

  const attach = (mediaStream: MediaStream) => {
    if (!elementRef.current) return;
    elementRef.current.srcObject = mediaStream;
  };

  const cleanup = () => {
    if (!elementRef.current) return;
    elementRef.current.srcObject = null;
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });
    streamRef.current = undefined;
  };

  const stop = () => {
    setActive(false);
    optionsRef.current.onStop?.(streamRef.current);
    cleanup();
  };

  const start = async (constraints?: MediaStreamConstraints) => {
    if (!supported) return;

    if (constraints) {
      constraintsRef.current = constraints;
      cleanup();
    }

    try {
      setLoading(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraintsRef.current);

      mediaStream.getTracks().forEach((track) => {
        track.onended = () => stop();
      });

      streamRef.current = mediaStream;
      setActive(true);
      attach(mediaStream);
      optionsRef.current.onStart?.(mediaStream);

      return mediaStream;
    } catch (requestError) {
      setActive(false);
      optionsRef.current.onError?.(requestError as Error);
      return;
    } finally {
      setLoading(false);
    }
  };

  const apply = async (constraints: MediaStreamConstraints) => {
    if (!streamRef.current || !elementRef.current) return false;
    const tasks: Promise<void>[] = [];

    if (constraints.video && typeof constraints.video === 'object') {
      streamRef.current
        .getVideoTracks()
        .forEach((track) =>
          tasks.push(track.applyConstraints(constraints.video as MediaTrackConstraints))
        );
    }

    if (constraints.audio && typeof constraints.audio === 'object') {
      streamRef.current
        .getAudioTracks()
        .forEach((track) =>
          tasks.push(track.applyConstraints(constraints.audio as MediaTrackConstraints))
        );
    }

    await Promise.all(tasks);
    constraintsRef.current = {
      ...constraintsRef.current,
      ...constraints,
      audio:
        typeof constraintsRef.current.audio === 'object' && typeof constraints.audio === 'object'
          ? { ...constraintsRef.current.audio, ...constraints.audio }
          : constraints.audio,
      video:
        typeof constraintsRef.current.video === 'object' && typeof constraints.video === 'object'
          ? { ...constraintsRef.current.video, ...constraints.video }
          : constraints.video
    };

    return true;
  };

  const restart = async () => {
    cleanup();
    return start();
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = (
      target ? isTarget.getElement(target) : internalRef.current
    ) as HTMLMediaElement;

    if (!element) return;
    elementRef.current = element;

    if (immediately) start();

    return () => {
      cleanup();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  const value = {
    stream: streamRef.current,
    active,
    supported,
    loading,
    start,
    apply,
    stop,
    restart
  };

  if (target) return value;
  return { ...value, ref: internalRef };
}) as UseMediaStream;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { stream, start, apply, stop } = useMediaStream(videoRef);
// or
const { ref, stream, start, apply, stop } = useMediaStream<HTMLVideoElement>();
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseMediaStreamOptions {
  /** Default constraints to be passed to `getUserMedia` on the first request */
  constraints?: MediaStreamConstraints;
  /** Whether the stream should be requested immediately */
  immediately?: boolean;
  /** The callback fired when requesting the stream fails */
  onError?: (error: Error) => void;
  /** The callback fired once the stream was successfully obtained */
  onStart?: (stream: MediaStream) => void;
  /** The callback fired when the stream is stopped */
  onStop?: (stream?: MediaStream) => void;
}

export interface UseMediaStreamReturn {
  /** Whether a stream is currently active */
  active: boolean;
  /** Whether a stream is currently being requested */
  loading: boolean;
  /** The current media stream, if any */
  stream?: MediaStream;
  /** Whether `mediaDevices.getUserMedia` is supported by the browser */
  supported: boolean;
  /** Apply constraints to the live media tracks without recreating the stream */
  apply: (constraints: MediaStreamConstraints) => Promise<boolean>;
  /** Stop the current stream and request a new one with the current constraints */
  restart: () => Promise<MediaStream | undefined>;
  /** Request and start the media stream */
  start: (constraints?: MediaStreamConstraints) => Promise<MediaStream | undefined>;
  /** Stop all tracks of the current media stream */
  stop: () => void;
}

export interface UseMediaStream {
  (target: HookTarget, options?: UseMediaStreamOptions): UseMediaStreamReturn;

  (options?: UseMediaStreamOptions): UseMediaStreamReturn & {
    ref: StateRef<HTMLVideoElement>;
  };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target video element the stream will be attached to |
| options.immediately | `boolean` | false | Whether the stream should be requested immediately |
| options.constraints | `MediaStreamConstraints` | - | Default constraints passed to `getUserMedia` |
| options.onStart | `(stream: MediaStream) => void` | - | Callback fired when the stream starts |
| options.onStop | `(stream?: MediaStream) => void` | - | Callback fired when the stream stops |
| options.onError | `(error: Error) => void` | - | Callback fired when the request fails |

#### Returns

`UseMediaStreamReturn` - An object containing the media stream state and controls

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.immediately | `boolean` | false | Whether the stream should be requested immediately |
| options.constraints | `MediaStreamConstraints` | - | Default constraints passed to `getUserMedia` |
| options.onStart | `(stream: MediaStream) => void` | - | Callback fired when the stream starts |
| options.onStop | `(stream?: MediaStream) => void` | - | Callback fired when the stream stops |
| options.onError | `(error: Error) => void` | - | Callback fired when the request fails |

#### Returns

`UseMediaStreamReturn & { ref: StateRef<HTMLVideoElement> }` - An object containing the media stream state, controls and ref