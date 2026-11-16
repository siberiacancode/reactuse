---
title: useOnline
description: Hook that manages if the user is online
category: browser
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useOnline

Hook that manages if the user is online

## Demo

```tsx
import { useOnline } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const Demo = () => {
  const online = useOnline();

  return (
    <section className='flex w-full justify-center p-4'>
      <span className='border-border bg-card text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium'>
        <span className={cn('size-2 rounded-full', online ? 'bg-green-500' : 'bg-destructive')} />
        {online ? 'Online' : 'Offline'}
      </span>
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
npx useverse@latest add useOnline
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useSyncExternalStore } from 'react';

const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => false;
const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

/**
 * @name useOnline
 * @description - Hook that manages if the user is online
 * @category Browser
 * @usage medium
 *
 * @browserapi navigator.onLine https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
 *
 * @returns {boolean} A boolean indicating if the user is online
 *
 * @example
 * const online = useOnline();
 */
export const useOnline = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

Update the import paths to match your project setup.

## Usage

```tsx
const online = useOnline();
```

## API

### Returns

`boolean` - A boolean indicating if the user is online