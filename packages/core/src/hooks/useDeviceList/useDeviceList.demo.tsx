import { useClickOutside, useDeviceList, useDisclosure } from '@siberiacancode/reactuse';
import { CheckIcon, MicIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const dropdownMenu = useDisclosure();
  const dropdownRef = useClickOutside<HTMLDivElement>(() => dropdownMenu.close());

  const [deviceId, setDeviceId] = useState<string>();
  const deviceList = useDeviceList((list) => setDeviceId(list[0].deviceId));

  const onOpen = () => {
    dropdownMenu.toggle();
  };

  const onDeviceSelect = (device: MediaDeviceInfo) => {
    setDeviceId(device.deviceId);
    dropdownMenu.close();
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
      <div ref={dropdownRef} className='relative'>
        <button
          aria-expanded={dropdownMenu.opened}
          aria-label='Select microphone'
          className='rounded-full!'
          data-size='icon'
          data-variant='outline'
          disabled={!deviceList.audioInputs.length}
          type='button'
          onClick={onOpen}
        >
          <MicIcon className='text-foreground size-5' />
        </button>

        {dropdownMenu.opened && (
          <div
            className='absolute top-full left-1/2 z-10 mt-3 w-64 -translate-x-1/2'
            data-slot='dropdown-menu-content'
          >
            <div className='text-muted-foreground px-2 py-1.5 text-xs font-medium'>Microphones</div>

            {!deviceList.audioInputs.length && (
              <div data-slot='dropdown-menu-item'>No microphones found</div>
            )}

            {deviceList.audioInputs.map((device, index) => {
              const selected = device.deviceId === deviceId;

              return (
                <div
                  key={device.deviceId}
                  data-slot='dropdown-menu-item'
                  onClick={() => onDeviceSelect(device)}
                >
                  <span className='truncate'>{device.label || `Microphone ${index + 1}`}</span>
                  {selected && <CheckIcon className='size-4 shrink-0' />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
