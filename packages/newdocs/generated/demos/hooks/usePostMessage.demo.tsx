'use client';

import { usePostMessage } from '@siberiacancode/reactuse';
import { KeyRoundIcon } from 'lucide-react';
import { useState } from 'react';

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const generateCode = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) => CHARS[byte % CHARS.length]).join(
    ''
  );

const Demo = () => {
  const [code, setCode] = useState<string>();

  const postMessage = usePostMessage<{ type: 'code'; value: string }>('*', (message) => {
    if (message.type === 'code') setCode(message.value);
  });

  const onRequest = () => postMessage({ type: 'code', value: generateCode() });

  return (
    <section className='flex w-full justify-center p-6'>
      <div className='border-border bg-card flex w-full max-w-xs flex-col items-center gap-5 rounded-xl border p-6 text-center'>
        <div className='bg-muted flex size-12 items-center justify-center rounded-full'>
          <KeyRoundIcon className='size-6' />
        </div>

        <div className='flex flex-col gap-1'>
          <h3 className='text-lg!'>One-time code</h3>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Request a single-use verification code from the service. A fresh one is delivered each
            time.
          </p>
        </div>

        {!code && (
          <button className='w-full' type='button' onClick={onRequest}>
            Get code
          </button>
        )}

        {code && (
          <div className='flex flex-col items-center gap-3'>
            <span className='text-foreground font-mono text-4xl font-bold tracking-[0.25em]'>
              {code}
            </span>
            <button
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
              data-variant='unstyled'
              type='button'
              onClick={onRequest}
            >
              Get a new code
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
