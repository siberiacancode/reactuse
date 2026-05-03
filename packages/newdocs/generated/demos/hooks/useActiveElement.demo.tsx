'use client';

import { useActiveElement } from '@siberiacancode/reactuse';
import { AtSignIcon } from 'lucide-react';

const Demo = () => {
  const activeElement = useActiveElement<HTMLDivElement>();
  const activeElementId = activeElement?.value?.dataset?.id ?? 'null';

  return (
    <section>
      <div ref={activeElement.ref} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h3>Contact form</h3>

          <p>
            Focus any field, textarea, or button with your mouse or keyboard to see which element is
            currently active inside this form: <code>{activeElementId}</code>
          </p>
        </div>

        <form className='flex flex-col gap-2'>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='flex flex-col gap-2 text-sm'>
              Name
              <input data-id='name' placeholder='John' type='text' />
            </label>

            <label className='flex flex-col gap-2 text-sm'>
              Email
              <div className='relative'>
                <AtSignIcon className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50' />

                <input
                  className='pl-8!'
                  data-id='email'
                  placeholder='john@example.com'
                  type='email'
                />
              </div>
            </label>
          </div>

          <div>
            <label className='flex flex-col gap-2 text-sm'>
              Message
              <textarea data-id='message' placeholder='Type your message...' rows={5} />
            </label>
          </div>

          <div className='mt-2 flex justify-end gap-2'>
            <button data-id='cancel' data-variant='outline' type='button'>
              Cancel
            </button>

            <button data-id='submit' type='button'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Demo;
