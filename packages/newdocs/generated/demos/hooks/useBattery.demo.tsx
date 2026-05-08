'use client';

import { useBattery } from '@siberiacancode/reactuse';
import {
  BatteryChargingIcon,
  BatteryFullIcon,
  BatteryLowIcon,
  BatteryMediumIcon,
  BatteryWarningIcon,
  Loader2Icon
} from 'lucide-react';

import { cn } from '@/utils/lib';

const getBatteryIcon = (level: number) => {
  if (level > 80) return BatteryFullIcon;
  if (level > 40) return BatteryMediumIcon;
  if (level > 15) return BatteryLowIcon;
  return BatteryWarningIcon;
};

const Demo = () => {
  const battery = useBattery();

  if (!battery.supported)
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );

  if (battery.value.loading) {
    return (
      <section className='flex justify-center'>
        <div className='relative flex h-[520px] w-76 items-center justify-center rounded-4xl border pt-12'>
          <div className='bg-border absolute top-3 left-1/2 h-5 w-18 -translate-x-1/2 rounded-full' />
          <Loader2Icon className='size-5 animate-spin' />
        </div>
      </section>
    );
  }

  const level = Math.round((battery.value.level ?? 0) * 100);
  const Icon = battery.value.charging ? BatteryChargingIcon : getBatteryIcon(level);
  const lowBattery = level <= 15 && !battery.value.charging;

  return (
    <section className='flex justify-center'>
      <div className='relative flex h-[430px] w-70 flex-col gap-7 rounded-4xl border px-6 pt-10 pb-8'>
        <div className='bg-border absolute top-3 left-1/2 h-5 w-18 -translate-x-1/2 rounded-full' />

        <div className='flex h-full flex-col gap-6 pt-6'>
          <div className='flex flex-col items-center gap-2'>
            <Icon className={cn('ml-2 size-30', lowBattery ? 'text-red-500' : 'text-foreground')} />

            <div className='flex flex-col items-center gap-1'>
              <div className='text-5xl font-semibold tracking-tight'>{level}%</div>
              <span className='text-muted-foreground text-xs tracking-wider uppercase'>
                {battery.value.charging ? 'Charging' : 'Battery'}
              </span>
            </div>
          </div>

          <div className='mt-auto flex flex-col gap-2'>
            <p className='text-muted-foreground text-center text-xs'>
              Battery has a lot of information, you can use it to get the battery level, charging
              status <code>{battery.value.charging ? 'charging' : 'discharging'}</code>, discharging
              time <code>{battery.value.dischargingTime}</code> and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
