import { useMount } from '@siberiacancode/reactuse';
import { RocketIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const STEPS = [
  { icon: RocketIcon, title: 'Get started fast' },
  { icon: ZapIcon, title: 'Powerful hooks' },
  { icon: SparklesIcon, title: 'Magic by default' }
];

const Demo = () => {
  const [started, setStarted] = useState(false);

  useMount(() => {
    const timeoutId = setTimeout(setStarted, 1000, true);
    return () => clearTimeout(timeoutId);
  });

  return (
    <section className='flex min-h-72 w-full max-w-sm flex-col items-center justify-center p-4'>
      <div
        className={cn(
          'flex flex-col items-center text-center transition-transform duration-700 ease-out',
          started ? '-translate-y-2' : 'translate-y-12'
        )}
      >
        <span
          className={cn(
            'text-foreground text-2xl font-bold transition-all duration-500 ease-out',
            started && 'scale-85'
          )}
        >
          Welcome back 👋
        </span>
        <span className='text-muted-foreground text-sm'>Here's everything you can do</span>
      </div>

      <div className='mt-6 flex w-full flex-col items-center gap-3'>
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className={cn(
                'text-muted-foreground flex items-center gap-2 transition-all duration-500 ease-out',
                started ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              )}
              style={{ transitionDelay: started ? `${300 + index * 120}ms` : '0ms' }}
            >
              <Icon className='size-4 shrink-0' />
              <span className='text-xs'>{step.title}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Demo;
