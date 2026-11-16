'use client'

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
