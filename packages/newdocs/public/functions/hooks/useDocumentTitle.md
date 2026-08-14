---
title: useDocumentTitle
description: Hook that manages the document title and allows updating it
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779453247000
---

# useDocumentTitle

Hook that manages the document title and allows updating it

## Demo

```tsx
import { useDocumentTitle } from '@siberiacancode/reactuse';
import { ClockIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

const ARTICLES = [
  {
    id: 'reactuse',
    tab: 'reactuse',
    title: 'Meet reactuse — a hooks library you will love',
    author: 'reactuse',
    readTime: '3 min read',
    description:
      'reactuse is a collection of essential React hooks for everyday development. Fully typed, tree-shakeable and built around a consistent API — whether you need debounce, local storage, media queries or device sensors, there is probably a hook for it.'
  },
  {
    id: 'siberiacancode',
    tab: 'siberiacancode',
    title: 'The siberiacancode community',
    author: 'debabin',
    readTime: '4 min read',
    description:
      'siberiacancode is an open source team building tools and content for the React ecosystem. The community grew around a simple idea — share what you learn. We maintain libraries, publish tutorials and help newcomers find their first contribution.'
  },
  {
    id: 'react',
    tab: 'react',
    title: 'React, and why it stuck around',
    author: 'siberiacancode',
    readTime: '5 min read',
    description:
      'React has been around for over a decade and it is still the default choice for building user interfaces. UI is a function of state — you describe what the screen should look like, and React takes care of the rest.'
  }
];

const Demo = () => {
  const [activeId, setActiveId] = useState(ARTICLES[0].id);
  const documentTitle = useDocumentTitle(ARTICLES[0].title);

  const article = ARTICLES.find((item) => item.id === activeId) ?? ARTICLES[0];

  const onTabClick = (item: (typeof ARTICLES)[number]) => {
    setActiveId(item.id);
    documentTitle.set(`${item.title} · reactuse`);
  };

  return (
    <section className='flex min-w-xs flex-col gap-4 md:min-w-md'>
      <div data-slot='tabs'>
        <div className='mb-6' data-slot='tabs-list'>
          {ARTICLES.map((item) => (
            <button
              key={item.id}
              data-state={cn(activeId === item.id && 'active')}
              data-variant='tabs-trigger'
              type='button'
              onClick={() => onTabClick(item)}
            >
              {item.tab}
            </button>
          ))}
        </div>

        <article className='flex flex-col gap-3' data-slot='tabs-content'>
          <header className='flex flex-col gap-2'>
            <h1 className='text-foreground text-xl leading-tight font-semibold'>{article.title}</h1>
            <div className='text-muted-foreground flex items-center gap-3 text-xs'>
              <span className='flex items-center gap-1.5'>
                <UserIcon className='size-3' />
                {article.author}
              </span>
              <span className='flex items-center gap-1.5'>
                <ClockIcon className='size-3' />
                {article.readTime}
              </span>
            </div>
          </header>

          <p className='text-foreground text-sm leading-relaxed'>{article.description}</p>
        </article>
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
npx useverse@latest add useDocumentTitle
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

/** The use document title options type */
export interface UseDocumentTitleOptions {
  /** Restore the previous title on unmount */
  restore?: boolean;
}

/** The use document title return type */
export interface UseDocumentTitleReturn {
  /** The current title */
  value: string;
  /** Function to update the title */
  set: (title: string) => void;
}

/**
 * @name useDocumentTitle
 * @description - Hook that manages the document title and allows updating it
 * @category Browser
 * @usage low

 * @browserapi document.title https://developer.mozilla.org/en-US/docs/Web/API/Document/title
 *
 * @param {string} [initialValue] The initial title. If not provided, the current document title will be used
 * @param {boolean} [options.restore] Restore the previous title on unmount
 * @returns {UseDocumentTitleReturn} An array containing the current title and a function to update the title
 *
 * @example
 * const { value, set } = useDocumentTitle();
 */
export function useDocumentTitle(
  initialValue?: string,
  options?: UseDocumentTitleOptions
): UseDocumentTitleReturn {
  const prevValueRef = useRef(typeof document !== 'undefined' ? document.title : '');
  const [value, setValue] = useState(
    initialValue ?? (typeof document !== 'undefined' ? document.title : '')
  );

  const set = (value: string) => {
    const updatedValue = value.trim();
    if (updatedValue.length > 0) document.title = updatedValue;
  };

  useEffect(() => {
    if (typeof value !== 'string') return;
    set(value);
  }, [value]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setValue((prevValue) => {
        if (document && document.title !== prevValue) {
          return document.title;
        }
        return prevValue;
      });
    });

    observer.observe(document.head.querySelector('title')!, {
      childList: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (options?.restore) {
      return () => {
        document.title = prevValueRef.current;
      };
    }
  }, []);

  return { value, set };
}
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, set } = useDocumentTitle();
```

## Type Declarations

```tsx
export interface UseDocumentTitleOptions {
  /** Restore the previous title on unmount */
  restore?: boolean;
}

export interface UseDocumentTitleReturn {
  /** The current title */
  value: string;
  /** Function to update the title */
  set: (title: string) => void;
}
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| initialValue | `string` | - | The initial title. If not provided, the current document title will be used |
| options.restore | `boolean` | - | Restore the previous title on unmount |

### Returns

`UseDocumentTitleReturn` - An array containing the current title and a function to update the title