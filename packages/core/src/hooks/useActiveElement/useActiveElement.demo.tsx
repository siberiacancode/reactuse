import { useActiveElement } from '@siberiacancode/reactuse';
import { AtSignIcon, InfoIcon } from 'lucide-react';

const HINTS = {
  name: 'Enter your full name so we know how to address you.',
  email: "We'll only use your email to reply — no spam, ever.",
  message: 'Describe your question or issue in as much detail as you like.',
  cancel: 'This will discard everything you have entered.',
  submit: 'Double-check your details, then send the form our way.'
};

const Demo = () => {
  const activeElement = useActiveElement<HTMLDivElement>();
  const activeId = activeElement?.value?.dataset?.id;
  const hint = activeId ? HINTS[activeId] : 'Focus any field to see a helpful tip here.';

  return (
    <section>
      <div ref={activeElement.ref} className='flex max-w-md flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h3>Contact form</h3>
          <p className='text-muted-foreground text-xs'>
            Fill in your details below and we'll get back to you shortly.
          </p>
        </div>

        <form className='flex flex-col gap-4'>
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

          <label className='flex flex-col gap-2 text-sm'>
            Message
            <textarea data-id='message' placeholder='Type your message...' rows={5} />
          </label>

          <div className='border-border bg-muted/40 flex items-start gap-2.5 rounded-lg border p-3'>
            <InfoIcon className='text-muted-foreground mt-0.5 size-4 shrink-0' />
            <p className='text-muted-foreground text-xs leading-relaxed'>{hint}</p>
          </div>

          <div className='flex justify-end gap-2'>
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
