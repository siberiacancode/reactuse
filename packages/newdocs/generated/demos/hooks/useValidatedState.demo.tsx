'use client'

import { useValidatedState } from '@siberiacancode/reactuse';
import { Mail } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

const Demo = () => {
  const [email, setEmail] = useValidatedState('hello@reactuse.org', (value) =>
    EMAIL_PATTERN.test(value)
  );

  return (
    <section className='flex max-w-sm flex-col gap-3'>
      <label className='text-sm font-medium' htmlFor='email'>
        Email
      </label>

      <div className='relative'>
        <Mail className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
        <input
          autoCapitalize='none'
          autoComplete='email'
          className='!pl-9'
          id='email'
          placeholder='you@example.com'
          spellCheck={false}
          type='email'
          value={email.value}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <span className='text-destructive h-4 text-xs'>
        {!email.valid && 'Enter a valid email address'}
      </span>
    </section>
  );
};

export default Demo;
