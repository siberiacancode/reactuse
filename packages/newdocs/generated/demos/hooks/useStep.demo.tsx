'use client'

import type { UseStepReturn } from '@siberiacancode/reactuse';

import { useStep } from '@siberiacancode/reactuse';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CodeIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  ZapIcon
} from 'lucide-react';
import { Activity, createContext, use } from 'react';

const OnboardingContext = createContext<UseStepReturn | null>(null);
const useOnboarding = () => use(OnboardingContext)!;

const StepHeader = ({ title, description }: { title: string; description: string }) => {
  const step = useOnboarding();
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-muted-foreground text-xs tabular-nums'>
        Step {step.currentStep} of {step.counts}
      </span>
      <span className='text-foreground text-xl font-semibold tracking-tight'>{title}</span>
      <span className='text-muted-foreground text-sm leading-snug'>{description}</span>
    </div>
  );
};

const StepWelcome = () => {
  const step = useOnboarding();
  return (
    <div className='flex flex-col gap-5'>
      <StepHeader
        description='A collection of essential React hooks for everyday development. Type-safe, tree-shakeable, and built to save you from rewriting the same logic in every project.'
        title='Welcome to reactuse'
      />

      <div className='flex justify-end'>
        <button type='button' onClick={step.next}>
          Continue
          <ArrowRightIcon className='size-4' />
        </button>
      </div>
    </div>
  );
};

const ADVANTAGES = [
  { icon: ZapIcon, text: '50+ hooks for state, sensors, storage and more' },
  { icon: CodeIcon, text: 'Fully typed APIs with a consistent shape' },
  { icon: ShieldCheckIcon, text: 'Tree-shakeable and battle-tested in production' }
];

const StepWhy = () => {
  const step = useOnboarding();
  return (
    <div className='flex flex-col gap-5'>
      <StepHeader description='Everything you need, nothing you don’t.' title='Why reactuse' />

      <div className='flex flex-col gap-3'>
        {ADVANTAGES.map(({ icon: Icon, text }) => (
          <div key={text} className='flex items-center gap-3'>
            <div className='bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg'>
              <Icon className='size-4' />
            </div>
            <span className='text-foreground text-sm'>{text}</span>
          </div>
        ))}
      </div>

      <div className='flex items-center justify-end gap-2'>
        <button data-variant='ghost' type='button' onClick={step.back}>
          <ArrowLeftIcon className='size-4' />
          Back
        </button>
        <button type='button' onClick={step.next}>
          Continue
          <ArrowRightIcon className='size-4' />
        </button>
      </div>
    </div>
  );
};

const StepDone = () => {
  const step = useOnboarding();
  return (
    <div className='flex flex-col items-center gap-3 py-4 text-center'>
      <div className='bg-muted flex size-12 items-center justify-center rounded-full text-2xl'>
        🎉
      </div>
      <div className='flex flex-col gap-1'>
        <span className='text-foreground text-lg font-semibold'>You're all set</span>
        <span className='text-muted-foreground text-sm'>
          Start building with reactuse right away.
        </span>
      </div>

      <button data-size='sm' data-variant='ghost' type='button' onClick={step.reset}>
        <RotateCcwIcon className='size-4' />
        Replay onboarding
      </button>
    </div>
  );
};

const Demo = () => {
  const step = useStep(3);
  const index = step.currentStep - 1;

  return (
    <OnboardingContext value={step}>
      <section className='flex w-full max-w-sm flex-col p-4'>
        <div className='bg-card text-card-foreground flex flex-col rounded-xl p-5'>
          <Activity mode={index === 0 ? 'visible' : 'hidden'}>
            <StepWelcome />
          </Activity>
          <Activity mode={index === 1 ? 'visible' : 'hidden'}>
            <StepWhy />
          </Activity>
          <Activity mode={index === 2 ? 'visible' : 'hidden'}>
            <StepDone />
          </Activity>
        </div>
      </section>
    </OnboardingContext>
  );
};

export default Demo;
