---
title: useStep
description: Hook that create stepper
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1776860709000
---

# useStep

Hook that create stepper

## Demo

```tsx
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
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useStep
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef, useState } from 'react';

/** The use step params type */
export interface UseStepParams {
  /** Initial value for step */
  initial: number;
  /** Maximum value for step */
  max: number;
}

/** The use step return type */
export interface UseStepReturn {
  /** Counts of steps */
  counts: number;
  /** Current value of step */
  currentStep: number;
  /** Boolean value if current step is first */
  isFirst: boolean;
  /** Boolean value if current step is last */
  isLast: boolean;
  /** Go to back step */
  back: () => void;
  /** Go to next step */
  next: () => void;
  /** Reset current step to initial value */
  reset: () => void;
  /** Go to custom step */
  set: (value: number | 'first' | 'last') => void;
}

const FIRST_STEP_VALUE = 1;

/**
 * @name useStep
 * @description - Hook that create stepper
 * @category State
 * @usage medium
 *
 * @overload
 * @param {number} max Maximum number of steps
 * @returns {UseStepReturn} An object contains variables and functions to change the step
 *
 * @example
 * const stepper = useStep(5);
 *
 * @overload
 * @param {number} params.max Maximum number of steps
 * @param {number} params.initial Initial value for step
 * @returns {UseStepReturn} An object contains variables and functions to change the step
 *
 * @example
 * const stepper = useStep({ initial: 2, max: 5 });
 */
export const useStep = (params: number | UseStepParams): UseStepReturn => {
  const max = typeof params === 'object' ? params.max : params;
  const initial = typeof params === 'object' ? params.initial : FIRST_STEP_VALUE;

  const initialStep = useRef(
    initial > max || initial < FIRST_STEP_VALUE ? FIRST_STEP_VALUE : initial
  );
  const [currentStep, setCurrentStep] = useState(initialStep.current);

  const isFirst = currentStep === FIRST_STEP_VALUE;
  const isLast = currentStep === max;

  const next = () => {
    if (isLast) return;
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const back = () => {
    if (isFirst) return;
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const reset = () => setCurrentStep(initialStep.current);

  const set = (value: number | 'first' | 'last') => {
    if (value === 'first') return setCurrentStep(FIRST_STEP_VALUE);
    if (value === 'last') return setCurrentStep(max);
    if (value >= max) return setCurrentStep(max);
    if (value <= FIRST_STEP_VALUE) return setCurrentStep(FIRST_STEP_VALUE);
    setCurrentStep(value);
  };

  return {
    counts: max,
    currentStep,
    isFirst,
    isLast,
    next,
    back,
    reset,
    set
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const stepper = useStep(5);
// or
const stepper = useStep({ initial: 2, max: 5 });
```

## Type Declarations

```tsx
export interface UseStepParams {
  /** Initial value for step */
  initial: number;
  /** Maximum value for step */
  max: number;
}

export interface UseStepReturn {
  /** Counts of steps */
  counts: number;
  /** Current value of step */
  currentStep: number;
  /** Boolean value if current step is first */
  isFirst: boolean;
  /** Boolean value if current step is last */
  isLast: boolean;
  /** Go to back step */
  back: () => void;
  /** Go to next step */
  next: () => void;
  /** Reset current step to initial value */
  reset: () => void;
  /** Go to custom step */
  set: (value: number | 'first' | 'last') => void;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| max | `number` | - | Maximum number of steps |

#### Returns

`UseStepReturn` - An object contains variables and functions to change the step

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| params.max | `number` | - | Maximum number of steps |
| params.initial | `number` | - | Initial value for step |

#### Returns

`UseStepReturn` - An object contains variables and functions to change the step