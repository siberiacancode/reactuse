'use client'

import { useOtpCredential } from '@siberiacancode/reactuse';
import { MessageSquareTextIcon } from 'lucide-react';
import { useRef, useState } from 'react';

const LENGTH = 6;

const Demo = () => {
  const [code, setCode] = useState<string[]>(Array.from({ length: LENGTH }).fill('') as string[]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const otpCredential = useOtpCredential({
    onSuccess: (credential) => {
      if (credential?.code) setCode(credential.code.slice(0, LENGTH).split(''));
    }
  });

  const focusLastEmpty = (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();
    const lastEmpty = code.findIndex((digit) => !digit);
    const target = lastEmpty === -1 ? LENGTH - 1 : lastEmpty;
    inputsRef.current[target]?.focus();
  };

  const onChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    setCode((currentCode) => {
      const next = [...currentCode];
      next[index] = digit;
      return next;
    });

    if (digit && index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, LENGTH)
      .split('');
    if (!digits.length) return;
    setCode(Array.from({ length: LENGTH }, (_, index) => digits[index] ?? ''));
    const cell = inputsRef.current[Math.min(digits.length, LENGTH - 1)];
    if (!cell) return;
    cell.focus();
  };

  const filled = code.every(Boolean);

  return (
    <section className='flex w-full max-w-xs flex-col items-center gap-4 p-6 text-center'>
      <div className='bg-muted flex size-16 items-center justify-center rounded-full'>
        <MessageSquareTextIcon className='size-8' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-xl!'>Enter OTP</h3>
        <p className='text-muted-foreground text-xs'>
          We've sent a 6-digit code to your phone. On a supported device it's read from the incoming
          SMS automatically.
        </p>
      </div>

      <div className='flex items-center gap-2'>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            autoComplete='one-time-code'
            className='focus-visible:border-ring focus-visible:ring-ring/50 h-12! w-11 text-center text-lg font-semibold tabular-nums focus-visible:ring-3'
            inputMode='numeric'
            maxLength={1}
            type='text'
            value={digit}
            onChange={(event) => onChange(index, event.target.value)}
            onKeyDown={(event) => onKeyDown(index, event)}
            onMouseDown={focusLastEmpty}
            onPaste={onPaste}
          />
        ))}
      </div>

      <button className='w-full' disabled={!filled} type='button' onClick={otpCredential.get}>
        Verify
      </button>
    </section>
  );
};

export default Demo;
