import { useBluetooth } from '@siberiacancode/reactuse';
import {
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
  HeadphonesIcon,
  KeyboardIcon,
  MouseIcon,
  SmartphoneIcon,
  SpeakerIcon,
  WatchIcon
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const getDeviceIcon = (name: string) => {
  const deviceName = name.toLowerCase();
  if (
    deviceName.includes('airpod') ||
    deviceName.includes('headphone') ||
    deviceName.includes('earbud') ||
    deviceName.includes('buds')
  )
    return HeadphonesIcon;
  if (deviceName.includes('keyboard')) return KeyboardIcon;
  if (deviceName.includes('mouse')) return MouseIcon;
  if (deviceName.includes('speaker') || deviceName.includes('soundbar')) return SpeakerIcon;
  if (deviceName.includes('watch')) return WatchIcon;
  if (
    deviceName.includes('phone') ||
    deviceName.includes('iphone') ||
    deviceName.includes('android')
  )
    return SmartphoneIcon;
  return Bluetooth;
};

const getCenterIcon = (scanning: boolean, connected: boolean) => {
  if (scanning) return BluetoothSearching;
  if (connected) return BluetoothConnected;
  return Bluetooth;
};

const getStatusLabel = (connected: boolean, hasDevice: boolean, scanning: boolean) => {
  if (connected) return 'Connected';
  if (hasDevice) return 'Not connected';
  if (scanning) return 'Searching...';
  return 'No device';
};

const Demo = () => {
  const [error, setError] = useState<string>();
  const [scanning, setScanning] = useState(false);
  const [device, setDevice] = useState<BluetoothDevice>();
  const [connected, setConnected] = useState(false);

  const bluetooth = useBluetooth({ acceptAllDevices: true });

  const onScan = async () => {
    try {
      setError(undefined);
      setScanning(true);

      const selectedDevice = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });

      setConnected(false);
      setDevice(selectedDevice);

      selectedDevice.addEventListener(
        'gattserverdisconnected',
        () => {
          setConnected(false);
          setDevice(undefined);
        },
        { once: true }
      );

      if (selectedDevice.gatt) {
        try {
          const server = await selectedDevice.gatt.connect();
          setConnected(server.connected);
        } catch {
          // connection is optional
        }
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  if (!bluetooth.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/bluetooth'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  const hasDevice = !!device;
  const DeviceIcon = getDeviceIcon(device?.name ?? '');
  const CenterIcon = getCenterIcon(scanning, connected);
  const statusLabel = getStatusLabel(connected, hasDevice, scanning);

  return (
    <section className='flex min-w-sm justify-center p-6'>
      <div className='flex w-72 flex-col items-center gap-5 rounded-2xl border p-6'>
        <div className='relative flex items-center justify-center'>
          {connected && (
            <span className='absolute size-14 animate-ping rounded-full bg-blue-500/20' />
          )}
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-full bg-muted',
              connected && 'bg-blue-500/10 text-blue-500',
              !connected && hasDevice && 'text-foreground',
              !connected && !hasDevice && 'text-muted-foreground'
            )}
          >
            {hasDevice && <DeviceIcon className='size-7' />}
            {!hasDevice && <CenterIcon className='size-7' />}
          </div>
        </div>

        <div className='flex flex-col items-center gap-1 text-center'>
          <p className='font-semibold'>{statusLabel}</p>
          {!hasDevice && (
            <p className='text-muted-foreground text-xs'>Tap scan to find nearby devices</p>
          )}
        </div>

        {hasDevice && (
          <div className='w-full rounded-xl border p-3'>
            <div className='flex items-center gap-3'>
              <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
                <DeviceIcon className='size-4' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{device?.name ?? 'Unknown device'}</p>
                <p className='text-muted-foreground text-[10px]'>{device?.id.slice(0, 12)}…</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                  connected ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                )}
              >
                {connected && 'Connected'}
                {!connected && 'Disconnected'}
              </span>
            </div>
          </div>
        )}

        {error && <p className='text-muted-foreground text-center text-xs'>{error}</p>}

        <button
          type='button'
          className='w-full rounded-xl py-2 text-sm font-medium'
          disabled={scanning}
          onClick={onScan}
        >
          {hasDevice && 'Scan again'}
          {!hasDevice && 'Scan for devices'}
        </button>
      </div>
    </section>
  );
};

export default Demo;
