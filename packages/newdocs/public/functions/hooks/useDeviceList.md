---
title: useDeviceList
description: Hook that returns the list of available media devices
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1783329679000
---

# useDeviceList

Hook that returns the list of available media devices

## Demo

```tsx
import { useClickOutside, useDeviceList, useDisclosure } from '@siberiacancode/reactuse';
import { CameraIcon, CheckIcon, MicIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const microphoneMenu = useDisclosure();
  const cameraMenu = useDisclosure();
  const microphoneRef = useClickOutside<HTMLDivElement>(() => microphoneMenu.close());
  const cameraRef = useClickOutside<HTMLDivElement>(() => cameraMenu.close());

  const [selectedDeviceIds, setSelectedDeviceIds] = useState<{
    audio?: string;
    video?: string;
  }>({});
  const deviceList = useDeviceList((list) => {
    setSelectedDeviceIds({
      audio: list.find((device) => device.kind === 'audioinput')?.deviceId,
      video: list.find((device) => device.kind === 'videoinput')?.deviceId
    });
  });

  const onMicrophoneOpen = () => microphoneMenu.toggle();
  const onCameraOpen = () => cameraMenu.toggle();

  const onDeviceSelect = (device: MediaDeviceInfo, menu: 'audio' | 'video') => {
    setSelectedDeviceIds((current) => ({ ...current, [menu]: device.deviceId }));

    if (menu === 'audio') {
      microphoneMenu.close();
      return;
    }

    cameraMenu.close();
  };

  if (!deviceList.supported) {
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );
  }

  return (
    <section className='flex w-full max-w-sm justify-center p-8'>
      <div className='flex items-center gap-3'>
        <div ref={microphoneRef} className='relative'>
          <button
            aria-expanded={microphoneMenu.opened}
            aria-label='Select microphone'
            className='rounded-full!'
            data-size='icon'
            data-variant='outline'
            disabled={!deviceList.audioInputs.length}
            type='button'
            onClick={onMicrophoneOpen}
          >
            <MicIcon className='text-foreground size-5' />
          </button>

          {microphoneMenu.opened && (
            <div
              className='absolute top-full left-1/2 z-10 mt-3 w-64 -translate-x-1/2'
              data-slot='dropdown-menu-content'
            >
              <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>
                Microphones
              </div>

              {!deviceList.audioInputs.length && (
                <div data-slot='dropdown-menu-item'>No microphones found</div>
              )}

              {deviceList.audioInputs.map((device, index) => {
                const selected = device.deviceId === selectedDeviceIds.audio;

                return (
                  <div
                    key={device.deviceId}
                    data-slot='dropdown-menu-item'
                    onClick={() => onDeviceSelect(device, 'audio')}
                  >
                    <span className='truncate'>{device.label || `Microphone ${index + 1}`}</span>
                    {selected && <CheckIcon className='size-4 shrink-0' />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div ref={cameraRef} className='relative'>
          <button
            aria-expanded={cameraMenu.opened}
            aria-label='Select camera'
            className='rounded-full!'
            data-size='icon'
            data-variant='outline'
            disabled={!deviceList.videoInputs.length}
            type='button'
            onClick={onCameraOpen}
          >
            <CameraIcon className='text-foreground size-5' />
          </button>

          {cameraMenu.opened && (
            <div
              className='absolute top-full left-1/2 z-10 mt-3 w-64 -translate-x-1/2'
              data-slot='dropdown-menu-content'
            >
              <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>Cameras</div>

              {!deviceList.videoInputs.length && (
                <div data-slot='dropdown-menu-item'>No cameras found</div>
              )}

              {deviceList.videoInputs.map((device, index) => {
                const selected = device.deviceId === selectedDeviceIds.video;

                return (
                  <div
                    key={device.deviceId}
                    data-slot='dropdown-menu-item'
                    onClick={() => onDeviceSelect(device, 'video')}
                  >
                    <span className='truncate'>{device.label || `Camera ${index + 1}`}</span>
                    {selected && <CheckIcon className='size-4 shrink-0' />}
                  </div>
                );
              })}
            </div>
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
npx useverse@latest add useDeviceList
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use device list callback type */
export type UseDeviceListCallback = (devices: MediaDeviceInfo[]) => void;

/** The use device list options type */
export interface UseDeviceListOptions {
  /** The constraints passed to `getUserMedia` when requesting permissions */
  constraints?: MediaStreamConstraints;
  /** Whether the device list should be requested immediately */
  immediately?: boolean;
  /** The callback fired when the device list updates */
  onUpdate?: UseDeviceListCallback;
}

/** The use device list return type */
export interface UseDeviceListReturn {
  /** The available audio input devices (microphones) */
  audioInputs: MediaDeviceInfo[];
  /** The available audio output devices (speakers) */
  audioOutputs: MediaDeviceInfo[];
  /** All available media devices */
  devices: MediaDeviceInfo[];
  /** Whether `mediaDevices.enumerateDevices` is supported by the browser */
  supported: boolean;
  /** The available video input devices (cameras) */
  videoInputs: MediaDeviceInfo[];
  /** Request permissions for media devices and re-read the available device list */
  trigger: () => Promise<MediaDeviceInfo[]>;
  /** Re-read the list of available devices */
  update: () => Promise<MediaDeviceInfo[]>;
}

export interface UseDeviceList {
  (callback?: UseDeviceListCallback): UseDeviceListReturn;

  (options?: UseDeviceListOptions): UseDeviceListReturn;
}

/**
 * @name useDeviceList
 * @description - Hook that returns the list of available media devices
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.mediaDevices.enumerateDevices https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
 *
 * @overload
 * @param {(devices: MediaDeviceInfo[]) => void} [callback] The callback fired when the device list updates
 * @returns {UseDeviceListReturn} An object containing the available devices
 *
 * @example
 * const { devices, videoInputs, audioInputs, audioOutputs, update, trigger } = useDeviceList((devices) => console.log(devices));
 *
 * @overload
 * @param {boolean} [options.immediately=true] Whether the device list should be requested immediately
 * @param {(devices: MediaDeviceInfo[]) => void} [options.onUpdate] The callback fired when the device list updates
 * @returns {UseDeviceListReturn} An object containing the available devices
 *
 * @example
 * const { devices, videoInputs, audioInputs, audioOutputs, update, trigger } = useDeviceList({ immediately: true });
 */
export const useDeviceList = ((...params: any[]) => {
  const options = (typeof params[0] === 'function' ? { onUpdate: params[0] } : params[0]) as
    | UseDeviceListOptions
    | undefined;

  const supported =
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    !!navigator.mediaDevices &&
    'enumerateDevices' in navigator.mediaDevices &&
    !!navigator.mediaDevices.enumerateDevices;

  const immediately = options?.immediately ?? true;

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const update = async () => {
    if (!supported) return;

    const list = await navigator.mediaDevices.enumerateDevices();

    setDevices(list);
    optionsRef.current?.onUpdate?.(list);
    return list;
  };

  const trigger = async (constraints?: MediaStreamConstraints) => {
    if (!supported) return;

    const list = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = list.some((device) => device.kind === 'videoinput');
    const hasMicrophone = list.some(
      (device) => device.kind === 'audioinput' || device.kind === 'audiooutput'
    );

    const video = constraints?.video ?? optionsRef.current?.constraints?.video ?? hasCamera;
    const audio = constraints?.video ?? optionsRef.current?.constraints?.audio ?? hasMicrophone;

    if (video || audio) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
        stream.getTracks().forEach((track) => track.stop());
      } catch {}
    }

    return update();
  };

  useEffect(() => {
    if (!supported) return;
    if (immediately) trigger();

    navigator.mediaDevices.addEventListener('devicechange', update);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', update);
    };
  }, []);

  return {
    trigger,
    devices,
    videoInputs: devices.filter((device) => device.kind === 'videoinput'),
    audioInputs: devices.filter((device) => device.kind === 'audioinput'),
    audioOutputs: devices.filter((device) => device.kind === 'audiooutput'),
    supported,
    update
  };
}) as UseDeviceList;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { devices, videoInputs, audioInputs, audioOutputs, update, trigger } = useDeviceList((devices) => console.log(devices));
// or
const { devices, videoInputs, audioInputs, audioOutputs, update, trigger } = useDeviceList({ immediately: true });
```

## Type Declarations

```tsx
export type UseDeviceListCallback = (devices: MediaDeviceInfo[]) => void;

export interface UseDeviceListOptions {
  /** The constraints passed to `getUserMedia` when requesting permissions */
  constraints?: MediaStreamConstraints;
  /** Whether the device list should be requested immediately */
  immediately?: boolean;
  /** The callback fired when the device list updates */
  onUpdate?: UseDeviceListCallback;
}

export interface UseDeviceListReturn {
  /** The available audio input devices (microphones) */
  audioInputs: MediaDeviceInfo[];
  /** The available audio output devices (speakers) */
  audioOutputs: MediaDeviceInfo[];
  /** All available media devices */
  devices: MediaDeviceInfo[];
  /** Whether `mediaDevices.enumerateDevices` is supported by the browser */
  supported: boolean;
  /** The available video input devices (cameras) */
  videoInputs: MediaDeviceInfo[];
  /** Request permissions for media devices and re-read the available device list */
  trigger: () => Promise<MediaDeviceInfo[]>;
  /** Re-read the list of available devices */
  update: () => Promise<MediaDeviceInfo[]>;
}

export interface UseDeviceList {
  (callback?: UseDeviceListCallback): UseDeviceListReturn;

  (options?: UseDeviceListOptions): UseDeviceListReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(devices: MediaDeviceInfo[]) => void` | - | The callback fired when the device list updates |

#### Returns

`UseDeviceListReturn` - An object containing the available devices

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.immediately | `boolean` | true | Whether the device list should be requested immediately |
| options.onUpdate | `(devices: MediaDeviceInfo[]) => void` | - | The callback fired when the device list updates |

#### Returns

`UseDeviceListReturn` - An object containing the available devices