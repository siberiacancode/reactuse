---
title: useEyeDropper
description: Hook that gives you access to the eye dropper
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1755262808000
---

# useEyeDropper

Hook that gives you access to the eye dropper

## Demo

```tsx
import { useCopy, useEyeDropper } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon, PipetteIcon } from 'lucide-react';

const Demo = () => {
  const eyeDropper = useEyeDropper();
  const { copy, copied } = useCopy();

  if (!eyeDropper.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const color = eyeDropper.value;

  return (
    <section className='flex flex-col items-center gap-3 p-4'>
      <div className='bg-card flex aspect-square w-[280px] items-center justify-center overflow-hidden rounded-2xl shadow-sm'>
        <img
          alt='Pick a color from this image'
          className='size-full object-contain p-4'
          draggable={false}
          src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png'
        />
      </div>

      <div className='bg-card flex w-[280px] items-center gap-3 rounded-xl p-2.5 shadow-sm'>
        <div
          className='border-border size-10 shrink-0 rounded-lg border'
          style={{ backgroundColor: color ?? 'transparent' }}
        />

        <div className='flex min-w-0 flex-1 flex-col leading-tight'>
          <span className='text-muted-foreground text-[9px] tracking-[0.15em] uppercase'>
            Selected color
          </span>
          <span className='text-foreground font-mono text-sm font-semibold uppercase tabular-nums'>
            {color ?? '—'}
          </span>
        </div>

        {color && (
          <button
            aria-label='Copy hex'
            data-size='icon'
            data-variant='ghost'
            type='button'
            onClick={() => copy(color)}
          >
            {copied && <CheckIcon className='size-3.5 text-green-500' />}
            {!copied && <CopyIcon className='size-3.5' />}
          </button>
        )}

        <button
          aria-label='Pick color'
          data-size='icon'
          type='button'
          onClick={() => eyeDropper.open()}
        >
          <PipetteIcon className='size-3.5' />
        </button>
      </div>
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
npx useverse@latest add useEyeDropper
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

export interface ColorSelectionOptions {
  signal?: AbortSignal;
}

export interface ColorSelectionResult {
  sRGBHex: string;
}

export interface EyeDropper {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

export interface EyeDropperConstructor {
  new (): EyeDropper;
}

declare global {
  interface Window {
    readonly EyeDropper?: EyeDropperConstructor | undefined;
  }
}

/** The color selection return type */
export interface UseEyeDropperReturn {
  /** The eye dropper supported status */
  supported: boolean;
  /** The eye dropper value */
  value?: string;
  /** The eye dropper open method */
  open: (colorSelectionOptions?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

/**
 * @name useEyeDropper
 * @description - Hook that gives you access to the eye dropper
 * @category Browser
 * @usage low
 *
 * @browserapi EyeDropper https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper
 *
 * @param {string} [initialValue=undefined] The initial value for the eye dropper
 * @returns {UseEyeDropperReturn} An object containing the supported status, the value and the open method
 *
 * @example
 * const { supported, value, open } = useEyeDropper();
 */
export const useEyeDropper = (
  initialValue: string | undefined = undefined
): UseEyeDropperReturn => {
  const supported = typeof window !== 'undefined' && 'EyeDropper' in window && !!window.EyeDropper;
  const [value, setValue] = useState(initialValue);

  const open = async (colorSelectionOptions?: ColorSelectionOptions) => {
    if (!window.EyeDropper) throw new Error('EyeDropper is not supported');
    const eyeDropper = new window.EyeDropper();
    const result = await eyeDropper.open(colorSelectionOptions);
    setValue(result.sRGBHex);
    return result;
  };

  return {
    supported,
    value,
    open
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { supported, value, open } = useEyeDropper();
```

## Type Declarations

```tsx
export interface ColorSelectionOptions {
  signal?: AbortSignal;
}

export interface ColorSelectionResult {
  sRGBHex: string;
}

export interface EyeDropper {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

export interface EyeDropperConstructor {
  new (): EyeDropper;
}

interface Window {
    readonly EyeDropper?: EyeDropperConstructor | undefined;
  }

export interface UseEyeDropperReturn {
  /** The eye dropper supported status */
  supported: boolean;
  /** The eye dropper value */
  value?: string;
  /** The eye dropper open method */
  open: (colorSelectionOptions?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `string` | undefined | The initial value for the eye dropper |

### Returns

`UseEyeDropperReturn` - An object containing the supported status, the value and the open method