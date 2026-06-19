'use client'

import { useBoolean } from '@siberiacancode/reactuse';
import { Eye, EyeOff } from 'lucide-react';

const Demo = () => {
  const [visible, toggle] = useBoolean();

  return (
    <section className='flex max-w-sm flex-col gap-3'>
      <label className='text-sm font-medium' htmlFor='password'>
        New password
      </label>

      <div className='relative'>
        <input
          className='pr-10'
          data-id='password'
          defaultValue='mysecretpassword'
          id='password'
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
    </section>
  );
};

export default Demo;
