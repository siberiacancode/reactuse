import { useBluetooth } from '@siberiacancode/reactuse';
import { BluetoothConnectedIcon, BluetoothIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const bluetooth = useBluetooth({ acceptAllDevices: true });
  const [connecting, setConnecting] = useState(false);

  const onConnect = async () => {
    setConnecting(true);

    try {
      await bluetooth.requestDevice();
    } catch {
      // The device picker can be closed without selecting a device.
    } finally {
      setConnecting(false);
    }
  };

  if (!bluetooth.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/bluetooth'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const Icon = bluetooth.connected ? BluetoothConnectedIcon : BluetoothIcon;

  return (
    <section className='flex min-w-sm flex-col items-center gap-4 p-6 text-center'>
      <div
        className={cn(
          'bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full',
          bluetooth.connected && 'bg-blue-500/10 text-blue-500'
        )}
      >
        <Icon className='size-7' />
      </div>

      <div aria-live='polite' className='flex flex-col gap-1'>
        <p className='font-semibold'>
          {bluetooth.connected ? 'Bluetooth connected' : 'Connect Bluetooth'}
        </p>
        <p className='text-muted-foreground text-sm'>
          {bluetooth.connected
            ? (bluetooth.device?.name ?? 'Your device is ready to use')
            : 'Pair with a nearby device'}
        </p>
      </div>

      {!bluetooth.connected && (
        <button disabled={connecting} type='button' onClick={onConnect}>
          {connecting ? 'Connecting...' : 'Connect'}
        </button>
      )}
    </section>
  );
};

export default Demo;
