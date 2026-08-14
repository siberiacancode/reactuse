---
title: useInfiniteScroll
description: Hook that defines the logic for infinite scroll
category: sensors
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1782543795000
---

# useInfiniteScroll

Hook that defines the logic for infinite scroll

## Demo

```tsx
import { useInfiniteScroll, useList } from '@siberiacancode/reactuse';
import { HeartIcon, Loader2Icon, MessageCircleIcon, Repeat2Icon } from 'lucide-react';

interface Post {
  handle: string;
  id: string;
  image?: string;
  likes: number;
  logo: string;
  name: string;
  replies: number;
  reposts: number;
  text: string;
  time: string;
}

const POSTS = [
  {
    name: 'Vercel',
    handle: 'vercel',
    logo: 'https://cdn.simpleicons.org/vercel/000000/ffffff',
    text: 'we just deployed our 100,000,000th preview. thanks to everyone who builds with us 🩷',
    image: 'https://cdn.simpleicons.org/vercel/000000/ffffff'
  },
  {
    name: 'Next.js',
    handle: 'nextjs',
    logo: 'https://cdn.simpleicons.org/nextdotjs/000000/ffffff',
    text: 'Just shipped Next.js 15.2 — incremental cache, faster cold starts and better DX 🚀'
  },
  {
    name: 'React',
    handle: 'reactjs',
    logo: 'https://cdn.simpleicons.org/react',
    text: 'tabs or spaces?'
  },
  {
    name: 'TypeScript',
    handle: 'typescript',
    logo: 'https://cdn.simpleicons.org/typescript',
    text: 'TypeScript 5.5 is out today. Inferred type predicates, regex literals 🎉',
    image: 'https://cdn.simpleicons.org/typescript'
  },
  {
    name: 'Tailwind CSS',
    handle: 'tailwindcss',
    logo: 'https://cdn.simpleicons.org/tailwindcss',
    text: 'Built-in dark mode arrives in v4.1. No config, no plugin — just data-theme on html and you are done.'
  },
  {
    name: 'GitHub',
    handle: 'github',
    logo: 'https://cdn.simpleicons.org/github/000000/ffffff',
    text: 'monorepo vs polyrepo... discuss ☕'
  },
  {
    name: 'reactuse',
    handle: 'reactuse',
    logo: 'https://cdn.simpleicons.org/react',
    text: "ESM is the future. CommonJS days are numbered. Don't @ me.",
    image: 'https://cdn.simpleicons.org/react'
  },
  {
    name: 'Vercel',
    handle: 'vercel',
    logo: 'https://cdn.simpleicons.org/vercel/000000/ffffff',
    text: 'serverless is great until the cold start hits at 2am'
  },
  {
    name: 'React',
    handle: 'reactjs',
    logo: 'https://cdn.simpleicons.org/react',
    text: 'New blog post: how we cut bundle size by 40% by removing one polyfill. Read the full breakdown on the blog',
    image: 'https://cdn.simpleicons.org/tailwindcss'
  },
  {
    name: 'GitHub',
    handle: 'github',
    logo: 'https://cdn.simpleicons.org/github/000000/ffffff',
    text: 'release notes for the v18 update are live — check the changelog for breaking changes before you upgrade'
  }
];

const createPost = (index: number): Post => {
  const template = POSTS[index % POSTS.length];
  const minutes = Math.floor(Math.random() * 600);
  const time = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h`;

  return {
    id: crypto.randomUUID(),
    ...template,
    time,
    likes: Math.floor(Math.random() * 2400),
    replies: Math.floor(Math.random() * 200),
    reposts: Math.floor(Math.random() * 600)
  };
};

const formatCount = (count: number) => {
  if (count < 1000) return count.toString();
  return `${(count / 1000).toFixed(1)}K`;
};

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => (
  <article className='border-border flex flex-col gap-1.5 border-b py-3 last:border-b-0'>
    <div className='flex items-center gap-2'>
      <div className='bg-muted/40 flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full'>
        <img alt={post.name} className='size-4 object-contain' src={post.logo} />
      </div>
      <span className='text-foreground text-sm font-semibold'>{post.name}</span>
      <span className='text-muted-foreground text-xs'>@{post.handle}</span>
      <span className='text-muted-foreground text-xs'>· {post.time}</span>
    </div>

    <p className='text-foreground text-sm leading-relaxed'>{post.text}</p>

    {post.image && (
      <div className='border-border bg-muted/40 mt-1 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border'>
        <img alt='Post attachment' className='size-1/3 object-contain' src={post.image} />
      </div>
    )}

    <div className='text-muted-foreground mt-1 flex items-center gap-5'>
      <span className='hover:text-foreground flex cursor-pointer items-center gap-1.5 text-xs transition-colors'>
        <MessageCircleIcon className='size-3.5' />
        {formatCount(post.replies)}
      </span>
      <span className='flex cursor-pointer items-center gap-1.5 text-xs transition-colors hover:text-green-500'>
        <Repeat2Icon className='size-3.5' />
        {formatCount(post.reposts)}
      </span>
      <span className='hover:text-destructive flex cursor-pointer items-center gap-1.5 text-xs transition-colors'>
        <HeartIcon className='size-3.5' />
        {formatCount(post.likes)}
      </span>
    </div>
  </article>
);

const Demo = () => {
  const list = useList<Post>(Array.from({ length: 8 }, (_, i) => createPost(i)));

  const feed = useInfiniteScroll<HTMLDivElement>(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      list.set((current) => [
        ...current,
        ...Array.from({ length: 5 }, (_, i) => createPost(current.length + i))
      ]);
    },
    { distance: 80 }
  );

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div ref={feed.ref} className='no-scrollbar flex h-[480px] flex-col overflow-y-auto'>
        {list.value.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {feed.loading && (
          <div className='flex items-center justify-center gap-2 py-4'>
            <Loader2Icon className='text-muted-foreground size-4 animate-spin' />
            <span className='text-muted-foreground text-xs'>Loading more posts...</span>
          </div>
        )}
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
npx useverse@latest add useInfiniteScroll
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

/** The use infinite scroll options type */
export interface UseInfiniteScrollOptions {
  /** The direction to trigger the callback */
  direction?: 'bottom' | 'left' | 'right' | 'top';
  /** The distance in pixels to trigger the callback */
  distance?: number;
  /** Whether there is more content to load */
  hasMore?: boolean;
  /** Whether to loading while the content doesn't overflow the viewport */
  immediately?: boolean;
}

/** The use infinite scroll return type */
export interface UseInfiniteScrollReturn {
  /** The loading state of the infinite scroll */
  loading: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseInfiniteScroll {
  (
    target: HookTarget,
    callback: (event?: Event) => Promise<void> | void,
    options?: UseInfiniteScrollOptions
  ): UseInfiniteScrollReturn;

  <Target extends Element>(
    callback: (event?: Event) => Promise<void> | void,
    options?: UseInfiniteScrollOptions,
    target?: never
  ): UseInfiniteScrollReturn & { ref: StateRef<Target> };
}

/**
 * @name useInfiniteScroll
 * @description - Hook that defines the logic for infinite scroll
 * @category Sensors
 * @usage medium
 *
 * @overload
 * @template Target The target element
 * @param {(event?: Event) => void | Promise<void>} callback The callback to execute when the scroll reaches the configured threshold
 * @param {number} [options.distance=10] The distance in pixels to trigger the callback
 * @param {string} [options.direction='bottom'] The direction to trigger the callback
 * @param {boolean} [options.hasMore=true] Whether there is more content to load
 * @param {boolean} [options.immediately=false] Whether to keep loading while the content doesn't overflow the viewport
 * @returns {UseInfiniteScrollReturn & { ref: StateRef<Target> }} An object containing the ref and loading
 *
 * @example
 * const { ref, loading } = useInfiniteScroll(() => console.log('infinite scroll'));
 *
 * @overload
 * @param {HookTarget} target The target element to detect infinite scroll for
 * @param {(event?: Event) => void | Promise<void>} callback The callback to execute when the scroll reaches the configured threshold
 * @param {number} [options.distance=10] The distance in pixels to trigger the callback
 * @param {string} [options.direction='bottom'] The direction to trigger the callback
 * @param {boolean} [options.hasMore=true] Whether there is more content to load
 * @param {boolean} [options.immediately=false] Whether to keep loading while the content doesn't overflow the viewport
 * @returns {UseInfiniteScrollReturn} An object containing the ref and loading
 *
 * @example
 * const { loading } = useInfiniteScroll(ref, () => console.log('infinite scroll'));
 */
export const useInfiniteScroll = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;
  const callback = (target ? params[1] : params[0]) as (event?: Event) => Promise<void> | void;
  const options = (target ? params[2] : params[1]) as UseInfiniteScrollOptions | undefined;

  const direction = options?.direction ?? 'bottom';
  const distance = options?.distance ?? 10;
  const hasMore = options?.hasMore ?? true;
  const immediately = options?.immediately ?? false;

  const isReverse = direction === 'top' || direction === 'left';
  const isVertical = direction === 'top' || direction === 'bottom';

  const [loading, setLoading] = useState(false);

  const internalRef = useRefState<Element>();
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;
  const internalLoadingRef = useRef(loading);
  internalLoadingRef.current = loading;
  const internalHasMoreRef = useRef(hasMore);
  internalHasMoreRef.current = hasMore;
  const prevSizeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!target && !internalRef.state) return;
    const element = (target ? isTarget.getElement(target) : internalRef.current) as Element;
    if (!element) return;

    const getEdgeDistance = () => {
      const { clientHeight, scrollHeight, scrollTop, clientWidth, scrollWidth, scrollLeft } =
        element;
      switch (direction) {
        case 'bottom':
          return scrollHeight - (scrollTop + clientHeight);
        case 'top':
          return scrollTop;
        case 'right':
          return scrollWidth - (scrollLeft + clientWidth);
        case 'left':
          return scrollLeft;
      }
    };

    const getSize = () => (isVertical ? element.scrollHeight : element.scrollWidth);
    const getOverflowing = () =>
      isVertical
        ? element.scrollHeight > element.clientHeight
        : element.scrollWidth > element.clientWidth;

    const trigger = async (event?: Event) => {
      if (internalLoadingRef.current || !internalHasMoreRef.current) return;
      internalLoadingRef.current = true;
      setLoading(true);
      try {
        await internalCallbackRef.current(event);
      } finally {
        internalLoadingRef.current = false;
        setLoading(false);
      }
    };

    const onLoadMore = (event: Event) => {
      if (getEdgeDistance()! <= distance) trigger(event);
    };
    element.addEventListener('scroll', onLoadMore);

    prevSizeRef.current = getSize();

    if (immediately && !getOverflowing()) trigger();
    const observer = new MutationObserver(() => {
      if (isReverse) {
        const previous = prevSizeRef.current;
        const size = getSize();
        if (!!previous && size > previous) {
          const delta = size - previous;
          const previousBehavior = (element as HTMLElement).style.scrollBehavior;
          (element as HTMLElement).style.scrollBehavior = 'auto';
          if (isVertical) element.scrollTop += delta;
          else element.scrollLeft += delta;
          (element as HTMLElement).style.scrollBehavior = previousBehavior;
        }
        prevSizeRef.current = size;
      }

      if (immediately && !getOverflowing()) trigger();
    });
    observer.observe(element, { childList: true });

    return () => {
      element.removeEventListener('scroll', onLoadMore);
      observer.disconnect();
    };
  }, [target && isTarget.getRawElement(target), internalRef.state, direction, distance]);

  if (target) return { loading };
  return {
    ref: internalRef,
    loading
  };
}) as UseInfiniteScroll;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { ref, loading } = useInfiniteScroll(() => console.log('infinite scroll'));
// or
const { loading } = useInfiniteScroll(ref, () => console.log('infinite scroll'));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export interface UseInfiniteScrollOptions {
  /** The direction to trigger the callback */
  direction?: 'bottom' | 'left' | 'right' | 'top';
  /** The distance in pixels to trigger the callback */
  distance?: number;
  /** Whether there is more content to load */
  hasMore?: boolean;
  /** Whether to loading while the content doesn't overflow the viewport */
  immediately?: boolean;
}

export interface UseInfiniteScrollReturn {
  /** The loading state of the infinite scroll */
  loading: boolean;
  /** The ref to attach to the element */
  ref: StateRef<Element>;
}

export interface UseInfiniteScroll {
  (
    target: HookTarget,
    callback: (event?: Event) => Promise<void> | void,
    options?: UseInfiniteScrollOptions
  ): UseInfiniteScrollReturn;

  <Target extends Element>(
    callback: (event?: Event) => Promise<void> | void,
    options?: UseInfiniteScrollOptions,
    target?: never
  ): UseInfiniteScrollReturn & { ref: StateRef<Target> };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(event?: Event) => void \| Promise<void>` | - | The callback to execute when the scroll reaches the configured threshold |
| options.distance | `number` | 10 | The distance in pixels to trigger the callback |
| options.direction | `string` | 'bottom' | The direction to trigger the callback |
| options.hasMore | `boolean` | true | Whether there is more content to load |
| options.immediately | `boolean` | false | Whether to keep loading while the content doesn't overflow the viewport |

#### Returns

`UseInfiniteScrollReturn & { ref: StateRef<Target> }` - An object containing the ref and loading

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `HookTarget` | - | The target element to detect infinite scroll for |
| callback | `(event?: Event) => void \| Promise<void>` | - | The callback to execute when the scroll reaches the configured threshold |
| options.distance | `number` | 10 | The distance in pixels to trigger the callback |
| options.direction | `string` | 'bottom' | The direction to trigger the callback |
| options.hasMore | `boolean` | true | Whether there is more content to load |
| options.immediately | `boolean` | false | Whether to keep loading while the content doesn't overflow the viewport |

#### Returns

`UseInfiniteScrollReturn` - An object containing the ref and loading