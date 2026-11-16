'use client'

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
