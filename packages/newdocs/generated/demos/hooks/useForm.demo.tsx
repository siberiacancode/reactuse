'use client'

import { useForm } from '@siberiacancode/reactuse';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Russian' },
  { value: 'de', label: 'German' }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const Demo = () => {
  const form = useForm({
    initialValues: {
      name: 'siberiacancode',
      email: 'hello@reactuse.org',
      bio: 'Building open-source React hooks',
      language: 'en',
      notifications: true,
      public: false
    },
    validateOnBlur: true
  });

  const values = form.watch();

  const onSubmit = form.handleSubmit((values) => {
    console.log('submit', values);
  });

  return (
    <section className='flex w-full max-w-md flex-col gap-1 p-4'>
      <div className='mb-3 flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Account settings</h2>
        <p className='text-muted-foreground text-xs'>Update your public profile and preferences.</p>
      </div>

      <form className='flex flex-col gap-4' onSubmit={onSubmit}>
        <div className='flex flex-col gap-1.5'>
          <label className='text-foreground text-xs font-medium' htmlFor='name'>
            Display name
          </label>
          <input
            className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
            id='name'
            placeholder='Your name'
            {...form.register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'At least 2 characters' }
            })}
          />
          {form.errors.name && <span className='text-destructive text-xs'>{form.errors.name}</span>}
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-foreground text-xs font-medium' htmlFor='email'>
            Email
          </label>
          <input
            className='border-border bg-card text-foreground rounded-md border px-3 py-2 text-sm outline-none'
            id='email'
            placeholder='you@example.com'
            type='email'
            {...form.register('email', {
              required: 'Email is required',
              pattern: { value: EMAIL_PATTERN, message: 'Invalid email format' }
            })}
          />
          {form.errors.email && (
            <span className='text-destructive text-xs'>{form.errors.email}</span>
          )}
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-foreground text-xs font-medium' htmlFor='bio'>
            Bio
          </label>
          <textarea
            className='border-border bg-card text-foreground min-h-[72px] resize-none rounded-md border px-3 py-2 text-sm outline-none'
            id='bio'
            placeholder='Tell something about yourself...'
            {...form.register('bio')}
          />
        </div>

        <div className='border-border flex flex-col gap-3 border-t pt-4'>
          <label className='flex cursor-pointer items-start justify-between gap-3'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-foreground text-xs font-medium'>Email notifications</span>
              <span className='text-muted-foreground text-[11px]'>
                Receive product updates and release notes
              </span>
            </div>
            <input role='switch' type='checkbox' {...form.register('notifications')} />
          </label>

          <div className='flex items-center justify-between gap-3'>
            <div className='flex flex-col gap-0.5'>
              <label className='text-foreground text-xs font-medium' htmlFor='language'>
                Language
              </label>
              <span className='text-muted-foreground text-[11px]'>
                Choose your preferred language
              </span>
            </div>
            <div className='relative'>
              <select
                className='border-border bg-card text-foreground w-32 appearance-none rounded-md border py-1.5 pr-7 pl-3 text-xs outline-none'
                id='language'
                {...form.register('language')}
              >
                {LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2' />
            </div>
          </div>
        </div>

        <label className='flex cursor-pointer items-start gap-3'>
          <span className='mt-0.5 flex shrink-0 items-center'>
            <input className='peer sr-only' type='checkbox' {...form.register('public')} />
            <span className='border-border peer-checked:border-foreground peer-checked:bg-foreground flex size-4 items-center justify-center rounded-[5px] border transition-colors'>
              {values.public && <CheckIcon className='text-background size-3' strokeWidth={3.5} />}
            </span>
          </span>
          <div className='flex flex-col gap-0.5'>
            <span className='text-foreground text-xs font-medium'>Make profile public</span>
            <span className='text-muted-foreground text-[11px]'>
              Anyone on the internet can see your profile
            </span>
          </div>
        </label>

        <div className='flex justify-end'>
          <button disabled={form.submitting} type='submit'>
            {form.submitting ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Demo;
