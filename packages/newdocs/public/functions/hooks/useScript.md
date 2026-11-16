---
title: useScript
description: Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781376500000
---

# useScript

Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities

## Demo

```tsx
import { useScript } from '@siberiacancode/reactuse';
import { Loader2Icon } from 'lucide-react';
import { useRef } from 'react';

const CONFETTI_SRC =
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';

const Demo = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const status = useScript(CONFETTI_SRC);

  const onCelebrate = () => {
    const confetti = (window as typeof window & { confetti?: (options: object) => void }).confetti;
    if (!confetti || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    confetti({
      particleCount: 100,
      spread: 80,
      startVelocity: 35,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight
      }
    });
  };

  return (
    <section className='flex flex-col items-center p-12'>
      <button
        ref={buttonRef}
        className='h-14! rounded-full! px-8!'
        data-variant='outline'
        disabled={status !== 'ready'}
        type='button'
        onClick={onCelebrate}
      >
        {status === 'ready' ? (
          <>🎉 Celebrate</>
        ) : (
          <>
            <Loader2Icon className='size-5 animate-spin' />
            Loading…
          </>
        )}
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
npx useverse@latest add useScript
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { ComponentProps } from 'react';

import { useEffect, useState } from 'react';

/** The use script status */
export type UseScriptStatus = 'error' | 'loading' | 'ready' | 'unknown';
export const SCRIPT_STATUS_ATTRIBUTE_NAME = 'script-status';

/** The use script options extends from attributes script tag */
export type UseScriptOptions = ComponentProps<'script'>;

/**
 * @name useScript
 * @description - Hook that manages a script with onLoad, onError, and removeOnUnmount functionalities
 * @category Elements
 * @usage low
 *
 * @param {string} src The source of the script
 * @param {UseScriptOptions} [options] The options of the script extends from attributes script tag
 * @param {boolean} [options.async=true] Whether to load the script asynchronously
 * @returns {UseScriptStatus} The status of the script
 *
 * @example
 * const status = useScript('https://example.com/script.js');
 */
export const useScript = (src: string, options: UseScriptOptions = {}) => {
  const [status, setStatus] = useState<UseScriptStatus>(() => {
    if (typeof document === 'undefined') return 'loading';

    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    const scriptStatus = script?.getAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME) as UseScriptStatus;
    if (scriptStatus) return scriptStatus;
    if (script) return 'unknown';

    return 'loading';
  });
  const { async = true } = options;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const existedScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    const scriptStatus = existedScript?.getAttribute(
      SCRIPT_STATUS_ATTRIBUTE_NAME
    ) as UseScriptStatus;
    if (scriptStatus) return setStatus(scriptStatus);
    if (existedScript) return setStatus('unknown');

    const script = document.createElement('script');
    script.src = src;
    script.async = async;

    for (const [key, value] of Object.entries(options)) {
      script.setAttribute(key, String(value));
    }

    script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'loading');
    document.body.appendChild(script);

    const onLoad = () => {
      script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'ready');
      setStatus('ready');
    };

    const onError = () => {
      script.setAttribute(SCRIPT_STATUS_ATTRIBUTE_NAME, 'error');
      setStatus('error');
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    return () => {
      script.remove();
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
  }, [src]);

  return status;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const status = useScript('https://example.com/script.js');
```

## Type Declarations

```tsx
import type { ComponentProps } from 'react';

export type UseScriptStatus = 'error' | 'loading' | 'ready' | 'unknown';

export type UseScriptOptions = ComponentProps<'script'>;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| src | `string` | - | The source of the script |
| options | `UseScriptOptions` | - | The options of the script extends from attributes script tag |
| options.async | `boolean` | true | Whether to load the script asynchronously |

### Returns

`UseScriptStatus` - The status of the script