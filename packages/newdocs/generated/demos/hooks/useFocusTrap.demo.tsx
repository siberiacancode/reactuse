'use client'

import type { SubmitEvent } from 'react';

import { useField, useFocusTrap } from '@siberiacancode/reactuse';
import { AtSignIcon, ChevronDownIcon, XIcon } from 'lucide-react';

const ROLES = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' }
];

const Demo = () => {
  const focusTrap = useFocusTrap<HTMLDivElement>(true);

  const emailField = useField('');
  const roleField = useField('member');
  const messageField = useField('');

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    focusTrap.disable();
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div
        ref={focusTrap.ref}
        className='border-border bg-card flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm'
      >
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='text-foreground text-sm font-semibold'>Invite team member ✨</h3>
            <p className='text-muted-foreground text-xs'>
              They will receive an invitation by email.
            </p>
          </div>
          <button
            aria-label='Close'
            data-size='icon-sm'
            data-variant='ghost'
            type='button'
            onClick={focusTrap.disable}
          >
            <XIcon className='size-3.5' />
          </button>
        </div>

        <form className='flex flex-col gap-3' onSubmit={onSubmit}>
          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='email'>
              Email
            </label>
            <div className='relative'>
              <AtSignIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2' />
              <input
                data-autofocus
                className='pl-9!'
                id='email'
                placeholder='teammate@company.com'
                type='email'
                {...emailField.register()}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='role'>
              Role
            </label>
            <div className='relative'>
              <select className='w-full!' id='role' {...roleField.register()}>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className='text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2' />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='message'>
              Message <span className='text-muted-foreground font-normal'>(optional)</span>
            </label>
            <textarea
              id='message'
              placeholder='Welcome to the team!'
              {...messageField.register()}
            />
          </div>

          <div className='flex items-center justify-end gap-2'>
            <button data-size='sm' data-variant='ghost' type='button' onClick={focusTrap.disable}>
              Cancel
            </button>
            <button data-size='sm' type='submit'>
              Send invite
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Demo;
