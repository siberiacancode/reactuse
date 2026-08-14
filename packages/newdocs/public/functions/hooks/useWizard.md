---
title: useWizard
description: Hook that manages a wizard
category: state
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782054576000
---

# useWizard

Hook that manages a wizard

## Demo

```tsx
import type { UseWizardReturn } from '@siberiacancode/reactuse';
import type { ReactNode } from 'react';

import { useField, useWizard } from '@siberiacancode/reactuse';
import { ArrowRightIcon, AtSignIcon, RotateCcwIcon, UserIcon } from 'lucide-react';
import { createContext, use, useState } from 'react';

type StepId = 'done' | 'email' | 'nickname' | 'preferences';

interface OnboardingContextValue {
  notifications: boolean;
  sms: boolean;
  wizard: UseWizardReturn<StepId>;
  setNotifications: (value: boolean) => void;
  setSms: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);
const useOnboarding = () => use(OnboardingContext)!;

const STEP_NUMBER = {
  nickname: 1,
  preferences: 2,
  email: 3,
  done: 4
};

const WIZARD_MAP = [
  { id: 'nickname', nodes: ['preferences', 'email'] },
  { id: 'preferences', nodes: ['nickname', 'email'] },
  { id: 'email', nodes: ['nickname', 'preferences', 'done'] },
  { id: 'done' }
];

interface StepHeaderProps {
  description: string;
  title: string;
}

const StepHeader = ({ title, description }: StepHeaderProps) => {
  const { wizard } = useOnboarding();
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-muted-foreground text-xs tabular-nums'>
        Step {STEP_NUMBER[wizard.currentStepId]} of 4
      </span>
      <span className='text-foreground text-xl font-semibold tracking-tight'>{title}</span>
      <span className='text-muted-foreground text-sm leading-snug'>{description}</span>
    </div>
  );
};

const NicknameStep = () => {
  const { wizard } = useOnboarding();
  const nicknameField = useField('');
  const value = nicknameField.watch();

  const onNext = () => {
    if (!value.trim()) return;
    const needsPreferences = Math.random() > 0.5;
    wizard.set(needsPreferences ? 'preferences' : 'email');
  };

  return (
    <div className='flex flex-col gap-5'>
      <StepHeader description='Choose a nickname to get started.' title='Welcome 👋' />

      <div className='relative'>
        <UserIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2' />
        <input className='pl-9!' placeholder='siberiacancode' {...nicknameField.register()} />
      </div>

      <div className='flex justify-end'>
        <button disabled={!value.trim()} type='button' onClick={onNext}>
          Continue
          <ArrowRightIcon className='size-4' />
        </button>
      </div>
    </div>
  );
};

const PreferencesStep = () => {
  const { wizard, notifications, setNotifications, sms, setSms } = useOnboarding();

  return (
    <div className='flex flex-col gap-5'>
      <StepHeader
        description='Decide how you want to hear from us. You can change this later.'
        title='Notifications'
      />

      <div className='flex flex-col gap-4'>
        <label className='flex cursor-pointer items-center justify-between gap-3'>
          <div className='flex flex-col leading-tight'>
            <span className='text-foreground text-sm font-medium'>Push notifications</span>
            <span className='text-muted-foreground text-xs'>Get notified about activity</span>
          </div>
          <input
            checked={notifications}
            role='switch'
            type='checkbox'
            onChange={(event) => setNotifications(event.target.checked)}
          />
        </label>

        <label className='flex cursor-pointer items-center gap-2.5'>
          <input checked={sms} type='checkbox' onChange={(event) => setSms(event.target.checked)} />
          <span className='text-foreground text-sm'>Also send me SMS updates</span>
        </label>
      </div>

      <div className='flex items-center justify-end gap-2'>
        <button data-variant='ghost' type='button' onClick={wizard.back}>
          Back
        </button>
        <button type='button' onClick={() => wizard.set('email')}>
          Continue
          <ArrowRightIcon className='size-4' />
        </button>
      </div>
    </div>
  );
};

const EmailStep = () => {
  const { wizard } = useOnboarding();
  const emailField = useField('');
  const value = emailField.watch();

  return (
    <div className='flex flex-col gap-5'>
      <StepHeader description='We will use it to keep your account secure.' title='Your email' />

      <div className='relative'>
        <AtSignIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2' />
        <input
          className='pl-9!'
          placeholder='you@example.com'
          type='email'
          {...emailField.register()}
        />
      </div>

      <div className='flex items-center justify-end gap-2'>
        <button data-variant='ghost' type='button' onClick={wizard.back}>
          Back
        </button>
        <button disabled={!value.trim()} type='button' onClick={() => wizard.set('done')}>
          Continue
          <ArrowRightIcon className='size-4' />
        </button>
      </div>
    </div>
  );
};

const DoneStep = () => {
  const { wizard } = useOnboarding();

  return (
    <div className='flex flex-col items-center gap-3 py-4 text-center'>
      <div className='bg-muted flex size-12 items-center justify-center rounded-full text-2xl'>
        🎉
      </div>
      <div className='flex flex-col gap-1'>
        <span className='text-foreground text-lg font-semibold'>Welcome, friend</span>
        <span className='text-muted-foreground text-sm'>Your account is ready to go.</span>
      </div>

      <button data-size='sm' data-variant='ghost' type='button' onClick={wizard.reset}>
        <RotateCcwIcon className='size-4' />
        Start over
      </button>
    </div>
  );
};

const STEPS: Record<StepId, () => ReactNode> = {
  nickname: NicknameStep,
  preferences: PreferencesStep,
  email: EmailStep,
  done: DoneStep
};

const Demo = () => {
  const wizard = useWizard(WIZARD_MAP, 'nickname') as UseWizardReturn<StepId>;
  const [notifications, setNotifications] = useState(true);
  const [sms, setSms] = useState(false);

  const value: OnboardingContextValue = {
    wizard,
    notifications,
    setNotifications,
    sms,
    setSms
  };

  const Step = STEPS[wizard.currentStepId];

  return (
    <OnboardingContext value={value}>
      <section className='flex w-full max-w-sm flex-col p-4'>
        <div className='bg-card text-card-foreground flex flex-col rounded-xl p-5'>
          <Step />
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
npx useverse@latest add useWizard
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

export interface WizardItem<WizardStepId> {
  id: WizardStepId;
  nodes?: WizardStepId[];
}

/** The use wizard return type */
export interface UseWizardReturn<WizardStepId> {
  /** Current wizard step id */
  currentStepId: WizardStepId;
  /** History of visited wizard step ids */
  history: WizardStepId[];
  /** Go one step back in wizard history */
  back: () => void;
  /** Reset wizard to initial step */
  reset: () => void;
  /** Go to custom available step */
  set: (id: WizardStepId) => void;
}

/**
 * @name useWizard
 * @description - Hook that manages a wizard
 * @category State
 * @usage medium
 *
 * @param {WizardItem<WizardStepId>[]} map The map of the wizard
 * @param {WizardStepId} [initialStepId] The initial step id
 * @returns {UseWizardReturn<WizardStepId>} An object containing the current step id and functions to interact with the wizard
 *
 * @example
 * const { currentStepId, set, reset, back, history } = useWizard([
 *  { id: 'step1', nodes: ['step2', 'step3'] },
 *  { id: 'step2', nodes: ['step3'] },
 *  { id: 'step3', nodes: [] },
 * ])
 */
export const useWizard = <WizardStepId extends string>(
  map: WizardItem<WizardStepId>[],
  initialStepId?: WizardStepId
): UseWizardReturn<WizardStepId> => {
  const initialId = initialStepId ?? map[0].id;
  const wizardMap = new Map(map.map((wizardItem) => [wizardItem.id, wizardItem]));
  const [currentStepId, setCurrentStepId] = useState(initialId);
  const [history, setHistory] = useState<WizardStepId[]>([initialId]);

  const set = (id: WizardStepId) => {
    if (!wizardMap.get(currentStepId)?.nodes?.includes(id))
      throw new Error(`Can't go to ${id} from ${currentStepId}`);

    setHistory([...history, id]);
    setCurrentStepId(id);
  };

  const back = () => {
    if (history.length === 1) return;

    const previousStepId = history[history.length - 2];
    if (!wizardMap.get(currentStepId)?.nodes?.includes(previousStepId))
      throw new Error(`Can't go to ${previousStepId} from ${currentStepId}`);

    setHistory(history.slice(0, -1));
    setCurrentStepId(history[history.length - 2]);
  };

  const reset = () => {
    setCurrentStepId(initialId);
    setHistory([initialId]);
  };

  return { currentStepId, set, reset, back, history };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { currentStepId, set, reset, back, history } = useWizard([ { id: 'step1', nodes: ['step2', 'step3'] }, { id: 'step2', nodes: ['step3'] }, { id: 'step3', nodes: [] }, ])
```

## Type Declarations

```tsx
export interface WizardItem<WizardStepId> {
  id: WizardStepId;
  nodes?: WizardStepId[];
}

export interface UseWizardReturn<WizardStepId> {
  /** Current wizard step id */
  currentStepId: WizardStepId;
  /** History of visited wizard step ids */
  history: WizardStepId[];
  /** Go one step back in wizard history */
  back: () => void;
  /** Reset wizard to initial step */
  reset: () => void;
  /** Go to custom available step */
  set: (id: WizardStepId) => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| map | `WizardItem<WizardStepId>[]` | - | The map of the wizard |
| initialStepId | `WizardStepId` | - | The initial step id |

### Returns

`UseWizardReturn<WizardStepId>` - An object containing the current step id and functions to interact with the wizard