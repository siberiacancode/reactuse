---
title: useFavicon
description: Hook that manages the favicon
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1755364807000
---

# useFavicon

Hook that manages the favicon

## Demo

```tsx
import { useFavicon } from '@siberiacancode/reactuse';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/utils/lib';

const FAVICONS = [
  { id: 'reactuse', label: 'reactuse', url: 'https://reactuse.org/favicon.ico' },
  { id: 'gitlab', label: 'GitLab', url: 'https://cdn.simpleicons.org/gitlab' },
  { id: 'vercel', label: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/000000/ffffff' },
  { id: 'discord', label: 'Discord', url: 'https://cdn.simpleicons.org/discord' }
];

const Demo = () => {
  const favicon = useFavicon(FAVICONS[0].url);

  return (
    <section className='flex w-full max-w-sm flex-col gap-3 p-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-foreground text-sm font-semibold'>Choose tab icon</h2>
        <p className='text-muted-foreground text-xs'>
          Click any tile to update the browser tab favicon.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
        {FAVICONS.map((item) => {
          const isActive = favicon.href === item.url;
          return (
            <div
              key={item.id}
              className={cn(
                'border-border bg-card hover:bg-accent/30 relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2 transition-colors',
                isActive && 'border-foreground bg-accent/30'
              )}
              aria-label={item.label}
              aria-pressed={isActive}
              role='button'
              tabIndex={0}
              onClick={() => favicon.set(item.url)}
            >
              <img alt={item.label} className='size-7 object-contain' src={item.url} />
              <span className='text-muted-foreground text-[10px] font-medium'>{item.label}</span>

              {isActive && (
                <span className='bg-foreground text-background absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full'>
                  <CheckIcon className='size-2.5' strokeWidth={3} />
                </span>
              )}
            </div>
          );
        })}
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
npx useverse@latest add useFavicon
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { Dispatch, SetStateAction } from 'react';

import { useState } from 'react';

import { useMount } from '../useMount/useMount';

/** The use favicon return type */
export type UseFaviconReturn = [string, Dispatch<SetStateAction<string>>];

/**
 * @name useFavicon
 * @description - Hook that manages the favicon
 * @category Browser
 * @usage low
 *
 * @param {string} [initialFavicon] The initial favicon. If not provided, the current favicon will be used
 * @returns {UseFaviconReturn} An array containing the current favicon and a function to update the favicon
 *
 * @example
 * const { href, set } = useFavicon('https://siberiacancode.github.io/reactuse/favicon.ico');
 */
export const useFavicon = (initialHref?: string) => {
  const [href, setHref] = useState(
    initialHref ??
      (typeof document !== 'undefined'
        ? document.querySelector<HTMLLinkElement>(`link[rel*="icon"]`)?.href
        : undefined)
  );

  const injectFavicon = (favicon: string) => {
    const link =
      document.querySelector<HTMLLinkElement>(`link[rel*="icon"]`) ||
      document.createElement('link');
    link.rel = 'icon';
    link.href = favicon;
    link.type = `image/${favicon.split('.').pop()}`;
    document.head.append(link);
  };

  const set = (favicon: string) => {
    setHref(favicon);
    injectFavicon(favicon);
  };

  useMount(() => {
    if (!initialHref) return;
    injectFavicon(initialHref);
  });

  return { href, set } as const;
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { href, set } = useFavicon('https://siberiacancode.github.io/reactuse/favicon.ico');
```

## Type Declarations

```tsx
import type { Dispatch, SetStateAction } from 'react';

export type UseFaviconReturn = [string, Dispatch<SetStateAction<string>>];
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialFavicon | `string` | - | The initial favicon. If not provided, the current favicon will be used |

### Returns

`UseFaviconReturn` - An array containing the current favicon and a function to update the favicon