---
title: useCopy
description: Hook that manages copying text with status reset
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779190580000
---

# useCopy

Hook that manages copying text with status reset

## Demo

```tsx
import { useCopy } from '@siberiacancode/reactuse';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

type PackageManager = 'bun' | 'npm' | 'pnpm' | 'yarn';

const COMMANDS: Record<PackageManager, string> = {
  pnpm: 'pnpm add @siberiacancode/reactuse',
  npm: 'npm install @siberiacancode/reactuse',
  yarn: 'yarn add @siberiacancode/reactuse',
  bun: 'bun add @siberiacancode/reactuse'
};

const TABS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];

const Demo = () => {
  const { copy, copied } = useCopy();
  const [selectedManager, setSelectedManager] = useState<PackageManager>('pnpm');

  return (
    <section className='flex w-full max-w-md flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h3>Installation</h3>
        <p className='text-muted-foreground text-sm'>
          Add <b>reactuse</b> to your project with your preferred package manager.
        </p>
      </div>

      <div data-slot='tabs'>
        <div className='mb-3' data-slot='tabs-list'>
          {TABS.map((tab) => (
            <button
              key={tab}
              data-state={cn(selectedManager === tab && 'active')}
              data-variant='tabs-trigger'
              type='button'
              onClick={() => setSelectedManager(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div data-slot='tabs-content'>
          <div className='relative flex items-center gap-2'>
            <input
              readOnly
              className='text-md! h-12! rounded-full! px-3!'
              value={COMMANDS[selectedManager]}
            />
            <button
              className='absolute top-2 right-2 h-8!'
              disabled={copied}
              type='button'
              onClick={() => copy(COMMANDS[selectedManager])}
            >
              {copied ? (
                <>
                  <CheckIcon className='size-4' /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className='size-4' /> Copy
                </>
              )}
            </button>
          </div>
        </div>
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
npx useverse@latest add useCopy
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

import { copy } from '@/utils/helpers';

/** The use copy return type */
export interface UseCopyReturn {
  /** Whether copy is in progress */
  copied: boolean;
  /** The copied value */
  value?: string;
  /** Function to copy text */
  copy: (value: string) => Promise<void>;
}

/** The use copy params type */
export interface UseCopyParams {
  /** Reset delay in milliseconds */
  resetDelay?: number;
}

/**
 * @name useCopy
 * @description - Hook that manages copying text with status reset
 * @category Browser
 * @usage medium

 * @browserapi navigator.clipboard https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 *
 * @param {number} [delay=1000] Delay in ms before resetting copied status
 * @returns {UseCopyReturn} An object containing the copied value, status and copy function
 *
 * @example
 * const { copied, value, copy } = useCopy();
 */
export const useCopy = (delay: number = 1000): UseCopyReturn => {
  const [value, setValue] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await copy(text);
    setValue(text);
    setCopied(true);
    setTimeout(setCopied, delay, false);
  };

  return { value, copied, copy: copyToClipboard };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { copied, value, copy } = useCopy();
```

## Type Declarations

```tsx
export interface UseCopyReturn {
  /** Whether copy is in progress */
  copied: boolean;
  /** The copied value */
  value?: string;
  /** Function to copy text */
  copy: (value: string) => Promise<void>;
}

export interface UseCopyParams {
  /** Reset delay in milliseconds */
  resetDelay?: number;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| delay | `number` | 1000 | Delay in ms before resetting copied status |

### Returns

`UseCopyReturn` - An object containing the copied value, status and copy function