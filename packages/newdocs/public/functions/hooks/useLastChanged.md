---
title: useLastChanged
description: Hook for records the timestamp of the last change
category: utilities
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1755150117000
---

# useLastChanged

Hook for records the timestamp of the last change

## Demo

```tsx
import { useLastChanged } from '@siberiacancode/reactuse';
import { FileTextIcon } from 'lucide-react';
import { useState } from 'react';

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const Demo = () => {
  const [title, setTitle] = useState('Quarterly product roadmap');
  const lastChanged = useLastChanged(title);

  return (
    <section className='flex w-full max-w-md flex-col gap-2 p-4'>
      <div className='text-muted-foreground flex items-center gap-1.5 text-[10px] tracking-wider uppercase'>
        <FileTextIcon className='size-3' />
        Project name
      </div>

      <div className='flex flex-col gap-1'>
        <h1
          contentEditable
          suppressContentEditableWarning
          className='text-foreground hover:bg-muted/30 focus:bg-muted/20 -mx-1 cursor-text rounded-md px-1 pb-1 text-2xl font-bold tracking-tight transition-colors outline-none'
          onBlur={(event) => setTitle(event.currentTarget.textContent ?? '')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
        >
          {title}
        </h1>

        <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
          {lastChanged ? `Edited at ${formatTime(lastChanged)}` : 'No changes yet'}
        </span>
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
npx useverse@latest add useLastChanged
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

/** The use last changed options type  */
export interface UseLastChangedOptions {
  initialValue?: number;
}

/**
 * @name useLastChanged
 * @description - Hook for records the timestamp of the last change
 * @category Utilities
 * @usage low
 *
 * @param {any} source  The source of the last change
 * @param {number | null} [options.initialValue=null] The initial value
 * @returns {number | null} Return timestamp of the last change
 *
 * @example
 * const lastChanged = useLastChanged(source);
 */
export const useLastChanged = (source: any, options?: UseLastChangedOptions): number | null => {
  const [lastChanged, setLastChanged] = useState(options?.initialValue ?? null);

  useDidUpdate(() => setLastChanged(Date.now()), [source]);

  return lastChanged;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const lastChanged = useLastChanged(source);
```

## Type Declarations

```tsx
export interface UseLastChangedOptions {
  initialValue?: number;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| source | `any` | - | The source of the last change |
| options.initialValue | `number \| null` | null | The initial value |

### Returns

`number | null` - Return timestamp of the last change