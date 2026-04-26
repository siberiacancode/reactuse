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
        <div className='flex h-96 w-76 items-center justify-center rounded-4xl border'>
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
      <div className='flex w-76 flex-col gap-7 rounded-4xl border px-6 pt-4 pb-8'>
        <div className='mb-2 flex items-center justify-between'>
          <div className='w-12' />

          <div className='bg-muted h-1 w-16 rounded-full' />

          <div
            className={cn(
              'flex items-center justify-end gap-1 text-xs',
              lowBattery ? 'text-red-500' : 'text-foreground'
            )}
          >
            <span>{level}%</span>
            <Icon className='size-5' />
          </div>
        </div>

        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <h2>Feedback</h2>

            <p className='text-xs'>
              Battery has a lot of information, you can use it to get the battery level, charging
              status <code>{battery.value.charging ? 'charging' : 'discharging'}</code>, discharging
              time <code>{battery.value.dischargingTime}</code> and more.
            </p>
          </div>

          <form className='flex flex-col gap-4'>
            <textarea placeholder='Tell us what can be improved...' rows={4} />

            <button type='button'>Send feedback</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Demo;
