'use client';

import { useNetwork } from '@siberiacancode/reactuse';
import { ActivityIcon, ArrowDownIcon, GaugeIcon, WifiIcon, WifiOffIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const Demo = () => {
  const network = useNetwork();

  return (
    <section className='flex w-full max-w-sm flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            network.online ? 'bg-green-500/15 text-green-500' : 'bg-destructive/15 text-destructive'
          )}
        >
          {network.online && <WifiIcon className='size-5' />}
          {!network.online && <WifiOffIcon className='size-5' />}
        </div>

        <div className='flex flex-col leading-tight'>
          <span className='text-foreground text-base font-semibold'>
            {network.online && 'Connected'}
            {!network.online && 'No connection'}
          </span>
          <span className='text-muted-foreground text-sm'>
            {network.online && network.type && `Connected via ${network.type}`}
            {network.online && !network.type && "You're online"}
            {!network.online && 'Check your network and try again'}
          </span>
        </div>
      </div>

      {network.online && (
        <div className='grid grid-cols-3 gap-2'>
          <div className='bg-muted/50 flex flex-col gap-1 rounded-lg p-3'>
            <div className='text-muted-foreground flex items-center gap-1 text-[10px] tracking-wider uppercase'>
              <GaugeIcon className='size-3' />
              Quality
            </div>
            <span className='text-foreground text-sm font-semibold uppercase'>
              {network.effectiveType ?? '—'}
            </span>
          </div>

          <div className='bg-muted/50 flex flex-col gap-1 rounded-lg p-3'>
            <div className='text-muted-foreground flex items-center gap-1 text-[10px] tracking-wider uppercase'>
              <ArrowDownIcon className='size-3' />
              Speed
            </div>
            <span className='text-foreground text-sm font-semibold'>
              {typeof network.downlink === 'number' && `${network.downlink}`}
              {typeof network.downlink !== 'number' && '—'}
              {typeof network.downlink === 'number' && (
                <span className='text-muted-foreground text-xs font-normal'> Mb/s</span>
              )}
            </span>
          </div>

          <div className='bg-muted/50 flex flex-col gap-1 rounded-lg p-3'>
            <div className='text-muted-foreground flex items-center gap-1 text-[10px] tracking-wider uppercase'>
              <ActivityIcon className='size-3' />
              Ping
            </div>
            <span className='text-foreground text-sm font-semibold'>
              {typeof network.rtt === 'number' && `${network.rtt}`}
              {typeof network.rtt !== 'number' && '—'}
              {typeof network.rtt === 'number' && (
                <span className='text-muted-foreground text-xs font-normal'> ms</span>
              )}
            </span>
          </div>
        </div>
      )}

      <span className='text-muted-foreground text-xs'>
        Try toggling your wifi or airplane mode to see the status update live.
      </span>
    </section>
  );
};

export default Demo;
