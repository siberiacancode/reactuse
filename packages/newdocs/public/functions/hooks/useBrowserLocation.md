---
title: useBrowserLocation
description: Hook that returns reactive browser location state with navigation controls
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1778075431000
---

# useBrowserLocation

Hook that returns reactive browser location state with navigation controls

## Demo

```tsx
import { useBrowserLocation } from '@siberiacancode/reactuse';
import {
  ArrowLeftIcon,
  AtSignIcon,
  CheckIcon,
  CreditCardIcon,
  LandmarkIcon,
  WalletIcon
} from 'lucide-react';

type PaymentMethod = 'bank' | 'card' | 'paypal';
const PAYMENT_METHODS = [
  {
    id: 'card',
    title: 'Card',
    description: 'Pay with Visa or Mastercard',
    icon: CreditCardIcon
  },
  {
    id: 'paypal',
    title: 'PayPal',
    description: 'Use your PayPal wallet',
    icon: WalletIcon
  },
  {
    id: 'bank',
    title: 'Bank transfer',
    description: 'Pay from your bank account',
    icon: LandmarkIcon
  }
] as const;

const Demo = () => {
  const location = useBrowserLocation();

  const step = Number(location.value.searchParams.get('step') ?? 1);
  const selectedMethod = location.value.searchParams.get('method') ?? 'card';
  const email = location.value.searchParams.get('email') ?? '';

  const currentMethod =
    PAYMENT_METHODS.find((method) => method.id === selectedMethod) ?? PAYMENT_METHODS[0];

  const updateSearch = (params: Record<string, number | string>) => {
    const searchParams = new URLSearchParams(location.value.search);

    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value));
    });

    location.push(`?${searchParams.toString()}`);
  };

  const onPaymentMethodChange = (method: PaymentMethod) => updateSearch({ step: 1, method, email });
  const onEmailChange = (email: string) => updateSearch({ email });
  const onCompletePayment = () => updateSearch({ step: 2, method: selectedMethod, email });

  return (
    <section className='flex w-full max-w-md min-w-0 flex-col gap-5 p-4'>
      {step === 1 && (
        <>
          <div className='flex flex-col gap-1'>
            <h3>Complete payment</h3>
            <p className='text-muted-foreground text-sm'>Enter your payment method</p>
          </div>

          <div className='flex flex-col gap-2'>
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <label
                  key={method.id}
                  className='border-border hover:bg-muted/50 has-[:checked]:border-foreground/30 has-[:checked]:bg-muted/50 relative flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-colors'
                >
                  <input
                    checked={isSelected}
                    className='absolute! top-4 right-4'
                    name='method'
                    type='radio'
                    onChange={() => onPaymentMethodChange(method.id)}
                  />

                  <div className='bg-card flex size-10 items-center justify-center rounded-full border'>
                    <Icon className='size-4' />
                  </div>

                  <span className='flex min-w-0 flex-1 flex-col gap-1 pr-6'>
                    <span className='text-sm'>{method.title}</span>
                    <span className='text-muted-foreground text-xs break-words'>
                      {method.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          <div className='relative'>
            <AtSignIcon className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50' />
            <input
              className='w-full pl-8!'
              placeholder='you@example.com'
              type='email'
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>

          <div className='flex justify-end'>
            <button disabled={!email} type='button' onClick={onCompletePayment}>
              Pay now
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className='flex flex-col gap-4'>
          <div className='border-border bg-card flex flex-col items-center gap-4 rounded-2xl border px-6 py-8 text-center'>
            <div className='flex size-14 items-center justify-center rounded-full bg-green-500/10 text-green-500'>
              <CheckIcon className='size-8' />
            </div>

            <div className='flex flex-col items-center gap-2'>
              <h4>Payment successful</h4>
              <p className='text-muted-foreground max-w-xs text-sm break-words'>
                Your order is confirmed and the receipt has been sent to {email}.
              </p>
            </div>

            <div className='bg-muted/50 flex w-full min-w-0 flex-col gap-2 rounded-xl p-4 text-left'>
              <div className='flex items-center justify-between gap-3 text-sm'>
                <span className='text-muted-foreground'>Payment method</span>
                <span className='text-foreground font-medium'>{currentMethod.title}</span>
              </div>
              <div className='flex items-center justify-between gap-3 text-sm'>
                <span className='text-muted-foreground'>Email</span>
                <span className='text-foreground min-w-0 text-right font-medium break-all'>
                  {email}
                </span>
              </div>
            </div>
          </div>

          <div className='flex justify-start'>
            <button data-variant='outline' type='button' onClick={() => location.back()}>
              <ArrowLeftIcon className='size-4' /> Back
            </button>
          </div>
        </div>
      )}
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
npx useverse@latest add useBrowserLocation
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useState } from 'react';

/** The browser location state type */
export interface BrowserLocationState {
  /** URL hash including # */
  hash?: string;
  /** URL host */
  host?: string;
  /** URL hostname */
  hostname?: string;
  /** Full URL */
  href?: string;
  /** Number of entries in the session history */
  length?: number;
  /** URL origin */
  origin?: string;
  /** URL pathname */
  pathname?: string;
  /** URL port */
  port?: string;
  /** URL protocol */
  protocol?: string;
  /** URL search string */
  search?: string;
  /** URL search parameters */
  searchParams: URLSearchParams;
  /** Browser history state */
  state?: unknown;
}

/** The use browser location return type */
export interface UseBrowserLocationReturn {
  /** Current browser location state */
  value: BrowserLocationState;
  /** Go back in history */
  back: () => void;
  /** Go forward in history */
  forward: () => void;
  /** Move by history delta */
  go: (delta: number) => void;
  /** Navigate to a new URL and push a history entry */
  push: (url: string | URL, state?: unknown, title?: string) => void;
  /** Navigate to a new URL and replace current history entry */
  replace: (url: string | URL, state?: unknown, title?: string) => void;
}

export const getLocationState = (): BrowserLocationState => ({
  searchParams: new URLSearchParams(window.location.search),
  state: window.history.state,
  length: window.history.length,
  hash: window.location.hash,
  host: window.location.host,
  hostname: window.location.hostname,
  href: window.location.href,
  origin: window.location.origin,
  pathname: window.location.pathname,
  port: window.location.port,
  protocol: window.location.protocol,
  search: window.location.search
});

/**
 * @name useBrowserLocation
 * @description - Hook that returns reactive browser location state with navigation controls
 * @category Browser
 * @usage medium
 *
 * @browserapi window.location https://developer.mozilla.org/en-US/docs/Web/API/Window/location
 * @browserapi window.history https://developer.mozilla.org/en-US/docs/Web/API/Window/history
 *
 * @returns {UseBrowserLocationReturn} The current browser location state and navigation methods
 *
 * @example
 * const { value, push, back, forward, go } = useBrowserLocation();
 */
export const useBrowserLocation = (): UseBrowserLocationReturn => {
  const [value, setValue] = useState<BrowserLocationState>(() => {
    if (typeof window === 'undefined')
      return {
        searchParams: new URLSearchParams()
      };
    return getLocationState();
  });

  useEffect(() => {
    const onLocationChange = () => {
      setValue(getLocationState());
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);

    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const push = (url: string | URL, state?: unknown, title: string = '') => {
    window.history.pushState(state, title, url);
    setValue(getLocationState());
  };

  const replace = (url: string | URL, state?: unknown, title: string = '') => {
    window.history.replaceState(state, title, url);
    setValue(getLocationState());
  };

  const back = () => {
    window.history.back();
  };

  const forward = () => {
    window.history.forward();
  };

  const go = (delta: number) => {
    window.history.go(delta);
  };

  return {
    value,
    push,
    replace,
    back,
    forward,
    go
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, push, back, forward, go } = useBrowserLocation();
```

## Type Declarations

```tsx
export interface BrowserLocationState {
  /** URL hash including # */
  hash?: string;
  /** URL host */
  host?: string;
  /** URL hostname */
  hostname?: string;
  /** Full URL */
  href?: string;
  /** Number of entries in the session history */
  length?: number;
  /** URL origin */
  origin?: string;
  /** URL pathname */
  pathname?: string;
  /** URL port */
  port?: string;
  /** URL protocol */
  protocol?: string;
  /** URL search string */
  search?: string;
  /** URL search parameters */
  searchParams: URLSearchParams;
  /** Browser history state */
  state?: unknown;
}

export interface UseBrowserLocationReturn {
  /** Current browser location state */
  value: BrowserLocationState;
  /** Go back in history */
  back: () => void;
  /** Go forward in history */
  forward: () => void;
  /** Move by history delta */
  go: (delta: number) => void;
  /** Navigate to a new URL and push a history entry */
  push: (url: string | URL, state?: unknown, title?: string) => void;
  /** Navigate to a new URL and replace current history entry */
  replace: (url: string | URL, state?: unknown, title?: string) => void;
}
```

## API

### Returns

`UseBrowserLocationReturn` - The current browser location state and navigation methods