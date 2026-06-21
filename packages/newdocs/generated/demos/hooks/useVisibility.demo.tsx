'use client'

import type { ReactNode } from 'react';

import { target, useVisibility } from '@siberiacancode/reactuse';
import { BlocksIcon, CheckIcon, ShieldCheckIcon, StarIcon, ZapIcon } from 'lucide-react';
import { useMemo } from 'react';

import { cn } from '@/utils/lib';

const ROOT_ID = 'reveal-scroll-root';

const RevealSection = ({ children }: { children: ReactNode }) => {
  const root = useMemo(() => target(`#${ROOT_ID}`), []);
  const visibility = useVisibility<HTMLDivElement>({
    root,
    threshold: 0.3
  });

  return (
    <div
      ref={visibility.ref}
      className={cn(
        'transition-opacity duration-700 ease-out',
        visibility.inView ? 'opacity-100' : 'opacity-0'
      )}
    >
      {children}
    </div>
  );
};

const FEATURES = [
  { icon: ZapIcon, title: 'Zero config', description: 'Import and go — no providers or setup.' },
  { icon: BlocksIcon, title: 'Composable', description: 'Hooks built to work together.' },
  { icon: ShieldCheckIcon, title: 'Fully typed', description: 'Complete TypeScript coverage.' }
];

const PERKS = ['50+ premium hooks', 'Priority support', 'Early access to new releases'];

const Demo = () => (
  <section className='flex w-full max-w-sm flex-col p-4'>
    <div
      id={ROOT_ID}
      className='no-scrollbar flex h-96 flex-col gap-12 overflow-y-auto scroll-smooth px-1 py-6'
    >
      <RevealSection>
        <div className='flex flex-col items-center gap-3 text-center'>
          <span className='bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium'>
            v1.0 is out
          </span>
          <h2 className='text-foreground text-2xl font-bold tracking-tight'>
            Essential React hooks
          </h2>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            A collection of hooks for everyday development. Typed, tested and tree-shakeable.
          </p>
          <button type='button' data-size='sm' className='mt-1'>
            Get started
          </button>
        </div>
      </RevealSection>

      <RevealSection>
        <div className='flex flex-col gap-4'>
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className='flex flex-col items-center gap-1.5 text-center'>
              <div className='bg-muted flex size-11 items-center justify-center rounded-xl'>
                <Icon className='text-foreground size-5' />
              </div>
              <h3 className='text-foreground text-sm font-semibold'>{title}</h3>
              <p className='text-muted-foreground text-xs leading-relaxed'>{description}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection>
        <div className='bg-card flex flex-col gap-4 rounded-xl p-5'>
          <div className='flex gap-0.5'>
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon key={index} className='size-4 fill-yellow-400 text-yellow-400' />
            ))}
          </div>
          <p className='text-foreground text-sm leading-relaxed'>
            “We replaced three internal hook libraries with reactuse. The API is consistent and the
            docs are excellent.”
          </p>
          <div className='flex items-center gap-3'>
            <div className='bg-muted flex size-9 items-center justify-center rounded-full text-sm font-medium'>
              D
            </div>
            <div className='flex flex-col leading-tight'>
              <span className='text-foreground text-sm font-medium'>debabin</span>
              <span className='text-muted-foreground text-xs'>Lead engineer</span>
            </div>
          </div>
        </div>
      </RevealSection>

      <RevealSection>
        <div className='bg-card flex flex-col gap-4 rounded-2xl p-5'>
          <div className='flex flex-col gap-1'>
            <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
              Pro
            </span>
            <div className='flex items-baseline gap-1'>
              <span className='text-foreground text-3xl font-bold tracking-tight'>$29</span>
              <span className='text-muted-foreground text-sm'>/ month</span>
            </div>
            <p className='text-muted-foreground text-xs'>
              Unlock exclusive hooks and premium features.
            </p>
          </div>

          <div className='flex flex-col gap-2'>
            {PERKS.map((perk) => (
              <div key={perk} className='flex items-center gap-2'>
                <CheckIcon className='size-4 shrink-0 text-green-500' />
                <span className='text-foreground text-sm'>{perk}</span>
              </div>
            ))}
          </div>

          <button type='button' className='w-full!'>
            Upgrade to Pro
          </button>
        </div>
      </RevealSection>

      <div className='shrink-0 py-2' />
    </div>
  </section>
);

export default Demo;
