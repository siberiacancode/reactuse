import { useMount } from '@siberiacancode/reactuse';
import { RocketIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const STEPS = [
  { icon: RocketIcon, title: 'Get started fast', description: 'Set up your workspace in seconds' },
  { icon: ZapIcon, title: 'Powerful hooks', description: 'Everything you need, ready to use' },
  {
    icon: SparklesIcon,
    title: 'Polished by default',
    description: 'Beautiful components out of the box'
  }
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
          'flex flex-col items-center text-center transition-all duration-700 ease-out',
          started ? 'scale-100' : 'scale-110'
        )}
      >
        <span
          className={cn(
            'text-foreground font-bold tracking-tight transition-all duration-700 ease-out',
            started ? 'text-2xl' : 'text-4xl'
          )}
        >
          Welcome back 👋
        </span>
        <span
          className={cn(
            'text-muted-foreground mt-2 transition-all duration-700 ease-out',
            started ? 'text-sm' : 'text-base'
          )}
        >
          Here's everything you can do
        </span>
      </div>

      <div
        className={cn(
          'flex w-full flex-col gap-4 overflow-hidden transition-all duration-700 ease-out',
          started ? 'mt-8 max-h-96 opacity-100' : 'mt-0 max-h-0 opacity-0'
        )}
      >
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className={cn(
                'flex items-center gap-3 transition-all duration-500 ease-out',
                started ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: started ? `${400 + index * 120}ms` : '0ms' }}
            >
              <Icon className='text-foreground size-4 shrink-0' />
              <div className='flex flex-col leading-tight'>
                <span className='text-foreground text-sm font-medium'>{step.title}</span>
                <span className='text-muted-foreground text-xs'>{step.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Demo;
