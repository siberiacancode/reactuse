'use client'

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

const WIZARD_MAP = [
  { id: 'nickname', nodes: ['preferences', 'email'] },
  { id: 'preferences', nodes: ['email'] },
  { id: 'email', nodes: ['done'] },
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
        Step {wizard.history.length} of 4
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
    // randomly decide whether the preferences step is needed
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

  const Step = STEPS[wizard.currentStepId as StepId];

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
