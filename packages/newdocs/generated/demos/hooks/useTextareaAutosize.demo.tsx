'use client'

import type { SubmitEvent } from 'react';

import { useField, useTextareaAutosize } from '@siberiacancode/reactuse';
import { UserIcon } from 'lucide-react';

const Demo = () => {
  const nameField = useField('');
  const message = useTextareaAutosize();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-col gap-0.5'>
          <h3 className='text-foreground text-sm font-semibold'>Feedback</h3>
          <p className='text-muted-foreground text-xs'>
            Tell us what's working, what's not, or what you'd love to see.
          </p>
        </div>

        <form className='flex flex-col gap-3' onSubmit={onSubmit}>
          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='name'>
              Name
            </label>
            <div className='relative'>
              <UserIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2' />
              <input
                className='pl-9!'
                id='name'
                placeholder='Your name'
                {...nameField.register()}
              />
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className='text-foreground text-xs font-medium' htmlFor='message'>
              Feedback
            </label>
            <textarea
              ref={message.ref}
              className='no-scrollbar resize-none'
              id='message'
              placeholder='Share your thoughts — this box grows as you type…'
              style={{ minHeight: '72px', maxHeight: '200px' }}
            />
          </div>

          <div className='flex items-center justify-end'>
            <button data-size='sm' disabled={!message.value.length} type='submit'>
              Send
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Demo;
