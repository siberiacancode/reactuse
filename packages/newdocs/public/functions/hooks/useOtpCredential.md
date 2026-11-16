---
title: useOtpCredential
description: Hook that creates an otp credential
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1767877541000
---

# useOtpCredential

Hook that creates an otp credential

## Demo

```tsx
import type { ClipboardEvent, KeyboardEvent, MouseEvent } from 'react';

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
```

## Installation

### Library

```bash
npm install @siberiacancode/reactuse
```

### CLI

```bash
npx useverse@latest add useOtpCredential
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef } from 'react';

declare global {
  interface OTPOptions {
    readonly transport: string[];
  }

  interface CredentialRequestOptions {
    readonly otp: OTPOptions;
  }

  interface Credential {
    readonly code: string;
  }
}

/* The use otp credential callback type */
export type UseOtpCredentialCallback = (otp: Credential | null) => void;

/* The use otp credential options type */
export interface UseOtpCredentialParams {
  /* The callback function to be invoked on error */
  onError?: (error: any) => void;
  /* The callback function to be invoked on success */
  onSuccess?: (credential: Credential | null) => void;
}

/* The use otp credential return type */
export interface UseOtpCredentialReturn {
  /* The abort function */
  abort: AbortController['abort'];
  /* The supported state of the otp credential */
  supported: boolean;
  /* The get otp credential function */
  get: () => Promise<Credential | null>;
}

export interface UseOtpCredential {
  (callback?: UseOtpCredentialCallback): UseOtpCredentialReturn;

  (params?: UseOtpCredentialParams): UseOtpCredentialReturn;
}

/**
 * @name useOtpCredential
 * @description - Hook that creates an otp credential
 * @category Browser
 * @usage low
 *
 * @browserapi navigator.credentials https://developer.mozilla.org/en-US/docs/Web/API/Navigator/credentials
 *
 * @overload
 * @param {UseOtpCredentialCallback} callback The callback function to be invoked
 * @returns {UseOtpCredentialReturn}
 *
 * @example
 * useOtpCredential((credential) => console.log(credential));
 *
 * @overload
 * @param {UseOtpCredentialCallback} params.onSuccess The callback function to be invoked on success
 * @param {UseOtpCredentialCallback} params.onError The callback function to be invoked on error
 * @returns {UseOtpCredentialReturn}
 *
 * @example
 * useOtpCredential({ onSuccess: (credential) => console.log(credential), onError: (error) => console.log(error) });
 */
export const useOtpCredential = ((...params: any[]) => {
  const supported =
    typeof navigator !== 'undefined' && 'OTPCredential' in navigator && !!navigator.OTPCredential;

  const options =
    typeof params[0] === 'object'
      ? params[0]
      : {
          onSuccess: params[0]
        };

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const get = async () => {
    if (!supported) return;

    abortControllerRef.current = new AbortController();
    try {
      const credential = await navigator.credentials.get({
        otp: { transport: ['sms'] },
        signal: abortControllerRef.current.signal
      });
      options.onSuccess?.(credential);

      return credential;
    } catch (error) {
      options.onError?.(error);
    }
  };

  const abort = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };

  return { supported, abort, get };
}) as UseOtpCredential;
```

Update the import paths to match your project setup.

## Usage

```tsx
useOtpCredential((credential) => console.log(credential));
// or
useOtpCredential({ onSuccess: (credential) => console.log(credential), onError: (error) => console.log(error) });
```

## Type Declarations

```tsx
interface OTPOptions {
    readonly transport: string[];
  }

interface CredentialRequestOptions {
    readonly otp: OTPOptions;
  }

interface Credential {
    readonly code: string;
  }

export type UseOtpCredentialCallback = (otp: Credential | null) => void;

export interface UseOtpCredentialParams {
  /* The callback function to be invoked on error */
  onError?: (error: any) => void;
  /* The callback function to be invoked on success */
  onSuccess?: (credential: Credential | null) => void;
}

export interface UseOtpCredentialReturn {
  /* The abort function */
  abort: AbortController['abort'];
  /* The supported state of the otp credential */
  supported: boolean;
  /* The get otp credential function */
  get: () => Promise<Credential | null>;
}

export interface UseOtpCredential {
  (callback?: UseOtpCredentialCallback): UseOtpCredentialReturn;

  (params?: UseOtpCredentialParams): UseOtpCredentialReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `UseOtpCredentialCallback` | - | The callback function to be invoked |

#### Returns

`UseOtpCredentialReturn`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| params.onSuccess | `UseOtpCredentialCallback` | - | The callback function to be invoked on success |
| params.onError | `UseOtpCredentialCallback` | - | The callback function to be invoked on error |

#### Returns

`UseOtpCredentialReturn`