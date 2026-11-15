'use client';

import { useBoolean, useField, useFocus } from '@siberiacancode/reactuse';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

interface Rule {
  description: string;
  id: string;
  title: string;
  check: (value: string) => boolean;
}

const RULES: Rule[] = [
  {
    id: 'length',
    title: 'At least 8 characters',
    description: 'The longer, the better',
    check: (value) => value.length >= 8
  },
  {
    id: 'uppercase',
    title: 'One uppercase letter',
    description: 'Like A, B, C...',
    check: (value) => /[A-Z]/.test(value)
  },
  {
    id: 'number',
    title: 'One number',
    description: 'Digits from 0 to 9',
    check: (value) => /\d/.test(value)
  },
  {
    id: 'special',
    title: 'One special character',
    description: 'Such as !, @, #, $, %',
    check: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value)
  }
];

const Demo = () => {
  const passwordField = useField('');
  const password = passwordField.watch();

  const { focused } = useFocus(passwordField.ref);
  const [visible, toggleVisible] = useBoolean(false);

  const passedRules = RULES.filter((rule) => rule.check(password)).length;
  const showRules = focused || (!!password && passedRules < RULES.length);

  return (
    <section className='flex w-full max-w-sm flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Create a password</h2>
        <p className='text-muted-foreground text-xs'>
          Choose a strong password to protect your account.
        </p>
      </div>

      <div className='relative'>
        <input
          className='border-border bg-card text-foreground w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none'
          id='password'
          placeholder='Enter password'
          type={visible ? 'text' : 'password'}
          {...passwordField.register()}
        />
        <button
          aria-label={visible ? 'Hide password' : 'Show password'}
          className='absolute top-1/2 right-0 -translate-y-1/2'
          data-variant='unstyled'
          type='button'
          onClick={() => toggleVisible()}
        >
          {visible ? <EyeOffIcon className='size-4' /> : <EyeIcon className='size-4' />}
        </button>

        {showRules && (
          <div className='border-border bg-card absolute top-full right-0 left-0 z-10 mt-2 flex flex-col gap-2 rounded-lg border p-3 shadow-lg'>
            <div className='flex items-center justify-between'>
              <span className='text-foreground text-xs font-medium'>Password requirements</span>
              <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
                {passedRules} / {RULES.length}
              </span>
            </div>

            <div className='flex flex-col gap-1.5'>
              {RULES.map((rule) => {
                const passed = rule.check(password);
                return (
                  <div key={rule.id} className='flex items-start gap-2'>
                    <span
                      className={cn(
                        'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full transition-colors',
                        passed ? 'bg-green-500/15 text-green-500' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {passed && <CheckIcon className='size-3' strokeWidth={3} />}
                      {!passed && <XIcon className='size-3' strokeWidth={2.5} />}
                    </span>
                    <div className='flex flex-col leading-tight'>
                      <span
                        className={cn(
                          'text-xs font-medium transition-colors',
                          passed ? 'text-foreground' : 'text-muted-foreground'
                        )}
                      >
                        {rule.title}
                      </span>
                      <span className='text-muted-foreground text-[10px]'>{rule.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
