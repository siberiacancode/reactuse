import { useBoolean } from '@siberiacancode/reactuse';
import { Eye, EyeOff } from 'lucide-react';

const Demo = () => {
  const [visible, toggle] = useBoolean();

  return (
    <section className='flex flex-col gap-4'>
      <p>Toggle password visibility</p>

      <div className='relative'>
        <input
          className='pr-10'
          data-id='password'
          placeholder='Enter your password'
          type={visible ? 'text' : 'password'}
        />

        <button
          className='absolute top-1/2 right-0 -translate-y-1/2'
          data-variant='unstyled'
          type='button'
          onClick={() => toggle()}
        >
          {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
        </button>
      </div>

      <p className='text-xs'>
        The current state is <code>{visible ? 'shown' : 'hidden'}</code>
      </p>
    </section>
  );
};

export default Demo;
