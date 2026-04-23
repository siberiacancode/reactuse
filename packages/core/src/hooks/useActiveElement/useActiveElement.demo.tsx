import { useActiveElement } from '@siberiacancode/reactuse';

const Demo = () => {
  const activeElement = useActiveElement<HTMLDivElement>();
  const activeElementId = activeElement?.value?.dataset?.id ?? 'null';

  return (
    <section>
      <div ref={activeElement.ref} className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h2>Contact form</h2>

          <p>
            Focus any field, textarea, or button with your mouse or keyboard to see which element is
            currently active inside this form: <code>{activeElementId}</code>
          </p>
        </div>

        <form className='flex flex-col gap-2'>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='flex flex-col gap-2'>
              Name
              <input data-id='first-name' placeholder='John' type='text' />
            </label>

            <label className='flex flex-col gap-2'>
              Email
              <input data-id='email' placeholder='john@example.com' type='email' />
            </label>
          </div>

          <div>
            <label className='flex flex-col gap-2'>
              Message
              <textarea data-id='message' placeholder='Type your message...' rows={5} />
            </label>
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <button data-id='cancel' data-variant='outline' type='button'>
              Cancel
            </button>

            <button data-id='submit' type='submit'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Demo;
