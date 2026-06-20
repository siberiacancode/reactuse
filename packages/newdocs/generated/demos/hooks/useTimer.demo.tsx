'use client'

import { useMutation, useTimer } from '@siberiacancode/reactuse';
import { Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from 'react';

const LENGTH = 6;

const sendCode = () =>
  new Promise<number>((resolve) => {
    const seconds = Math.floor(Math.random() * 16) + 5;
    setTimeout(resolve, 1200, seconds);
  });

const Demo = () => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const timer = useTimer(10);
  const sendCodeMutation = useMutation(sendCode);

  const focusLastEmpty = (event: MouseEvent<HTMLInputElement>) => {
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

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
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

  const onResend = async () => {
    const seconds = await sendCodeMutation.mutateAsync();
    timer.restart(seconds);
  };

  const filled = code.every(Boolean);

  return (
    <section className='flex w-full max-w-xs flex-col items-center gap-4 p-6 text-center'>
      <div className='bg-muted flex size-16 items-center justify-center rounded-full'>
        <ShieldCheckIcon className='size-8' />
      </div>

      <div className='flex flex-col gap-1'>
        <h3 className='text-xl!'>Enter OTP</h3>
        <p className='text-muted-foreground text-xs'>
          We've sent a 6-digit code to your phone. Enter it below to verify your number.
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

      <button className='w-full' disabled={!filled} type='button'>
        Verify
      </button>

      <div className='flex items-center gap-1.5 text-xs'>
        {timer.active ? (
          <span className='text-muted-foreground tabular-nums'>Resend in {timer.seconds}s</span>
        ) : (
          <button
            className='text-foreground inline-flex items-center gap-1 font-medium hover:underline disabled:opacity-50'
            data-variant='unstyled'
            disabled={sendCodeMutation.isLoading}
            type='button'
            onClick={onResend}
          >
            {sendCodeMutation.isLoading && <Loader2Icon className='size-3 animate-spin' />}
            {sendCodeMutation.isLoading ? 'Sending…' : 'Resend code'}
          </button>
        )}
      </div>
    </section>
  );
};

export default Demo;
