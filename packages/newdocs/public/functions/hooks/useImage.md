---
title: useImage
description: Hook that load an image in the browser
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1754977987000
---

# useImage

Hook that load an image in the browser

## Demo

```tsx
import { useImage } from '@siberiacancode/reactuse';
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';

const MIN_ID = 1;
const MAX_ID = 151;

const getImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const getFilename = (id: number) => `pokemon-${String(id).padStart(3, '0')}.png`;

const downloadImage = (img: HTMLImageElement, filename: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext('2d')!.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(blobUrl);
  });
};

const Demo = () => {
  const [id, setId] = useState(MIN_ID);

  const image = useImage(getImageUrl(id), { crossorigin: 'anonymous' });
  const filename = getFilename(id);
  const isLoading = image.isLoading || image.isRefetching;

  const onPrev = () => setId((value) => Math.max(MIN_ID, value - 1));
  const onNext = () => setId((value) => Math.min(MAX_ID, value + 1));
  const onDownload = () => {
    if (!image.data) return;
    downloadImage(image.data, filename);
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='bg-card relative flex h-[240px] items-center justify-center overflow-hidden rounded-xl shadow-sm'>
        {isLoading && (
          <div className='bg-card/70 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]'>
            <Loader2Icon className='text-muted-foreground size-8 animate-spin' />
          </div>
        )}

        {image.data && (
          <img
            alt={filename}
            className='animate-in fade-in h-[160px] object-contain duration-300'
            src={image.data.src}
          />
        )}

        <button
          aria-label='Previous'
          className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full!'
          data-size='icon'
          data-variant='ghost'
          disabled={id === MIN_ID}
          type='button'
          onClick={onPrev}
        >
          <ChevronLeftIcon className='size-4' />
        </button>

        <button
          aria-label='Next'
          className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full!'
          data-size='icon'
          data-variant='ghost'
          disabled={id === MAX_ID}
          type='button'
          onClick={onNext}
        >
          <ChevronRightIcon className='size-4' />
        </button>

        <button
          aria-label='Download'
          className='absolute top-3 right-3 rounded-full!'
          data-size='icon'
          data-variant='ghost'
          disabled={isLoading || !image.data}
          type='button'
          onClick={onDownload}
        >
          <DownloadIcon className='size-4' />
        </button>

        <span className='text-foreground absolute bottom-5 flex w-full items-center justify-between px-4 font-mono text-xs font-semibold'>
          {filename}
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
npx useverse@latest add useImage
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { UseQueryOptions, UseQueryReturn } from '../useQuery/useQuery';

import { useQuery } from '../useQuery/useQuery';

/** The use image options */
export interface UseImageOptions {
  /** The alt of the image */
  alt?: string;
  /** The class of the image */
  class?: string;
  /** The crossorigin of the image */
  crossorigin?: string;
  /** The loading of the image */
  loading?: HTMLImageElement['loading'];
  /** The referrer policy of the image */
  referrerPolicy?: HTMLImageElement['referrerPolicy'];
  /** The sizes of the image */
  sizes?: string;
  /** The srcset of the image */
  srcset?: string;
}

/** The use image return type */
export type UseImageReturn = UseQueryReturn<HTMLImageElement>;

const loadImage = async (src: string, options: UseImageOptions = {}): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const { srcset, sizes, class: className, loading, crossorigin, referrerPolicy } = options;

    img.src = src;
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    if (className) img.className = className;
    if (loading) img.loading = loading;
    if (crossorigin) img.crossOrigin = crossorigin;

    if (referrerPolicy) img.referrerPolicy = referrerPolicy;

    img.onload = () => resolve(img);
    img.onerror = reject;
  });

/**
 * @name useImage
 * @description - Hook that load an image in the browser
 * @category Elements
 * @usage low
 *
 * @param {string} src The source of the image
 * @param {string} [options.srcset] The srcset of the image
 * @param {string} [options.sizes] The sizes of the image
 * @param {string} [options.alt] The alt of the image
 * @param {string} [options.class] The class of the image
 * @param {HTMLImageElement['loading']} [options.loading] The loading of the image
 * @param {string} [options.crossorigin] The crossorigin of the image
 * @param {HTMLImageElement['referrerPolicy']} [options.referrerPolicy] The referrerPolicy of the image
 * @param {DependencyList} [options.keys] The dependencies for the hook
 * @param {(data: Data) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @param {number} [options.refetchInterval] The refetch interval
 * @param {boolean | number} [options.retry] The retry count of requests
 * @returns {UseImageReturn} An object with the state of the image
 *
 * @example
 * const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useImage('https://example.com/image.png');
 */
export const useImage = (
  src: string,
  options?: UseImageOptions &
    Omit<
      UseQueryOptions<HTMLImageElement, HTMLImageElement>,
      'initialData' | 'placeholderData' | 'select'
    >
) =>
  useQuery(
    () =>
      loadImage(src, {
        alt: options?.alt,
        class: options?.class,
        crossorigin: options?.crossorigin,
        loading: options?.loading,
        referrerPolicy: options?.referrerPolicy,
        sizes: options?.sizes,
        srcset: options?.srcset
      }),
    {
      keys: [src, ...(options?.keys ?? [])],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
      refetchInterval: options?.refetchInterval,
      retry: options?.retry
    }
  );
```

Update the import paths to match your project setup.

## Usage

```tsx
const { data, isLoading, isError, isSuccess, error, refetch, isRefetching } = useImage('https://example.com/image.png');
```

## Type Declarations

```tsx
import type { UseQueryOptions, UseQueryReturn } from '../useQuery/useQuery';

export interface UseImageOptions {
  /** The alt of the image */
  alt?: string;
  /** The class of the image */
  class?: string;
  /** The crossorigin of the image */
  crossorigin?: string;
  /** The loading of the image */
  loading?: HTMLImageElement['loading'];
  /** The referrer policy of the image */
  referrerPolicy?: HTMLImageElement['referrerPolicy'];
  /** The sizes of the image */
  sizes?: string;
  /** The srcset of the image */
  srcset?: string;
}

export type UseImageReturn = UseQueryReturn<HTMLImageElement>;
```

## API

### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| src | `string` | - | The source of the image |
| options.srcset | `string` | - | The srcset of the image |
| options.sizes | `string` | - | The sizes of the image |
| options.alt | `string` | - | The alt of the image |
| options.class | `string` | - | The class of the image |
| options.loading | `HTMLImageElement['loading']` | - | The loading of the image |
| options.crossorigin | `string` | - | The crossorigin of the image |
| options.referrerPolicy | `HTMLImageElement['referrerPolicy']` | - | The referrerPolicy of the image |
| options.keys | `DependencyList` | - | The dependencies for the hook |
| options.onSuccess | `(data: Data) => void` | - | The callback function to be invoked on success |
| options.onError | `(error: Error) => void` | - | The callback function to be invoked on error |
| options.refetchInterval | `number` | - | The refetch interval |
| options.retry | `boolean \| number` | - | The retry count of requests |

### Returns

`UseImageReturn` - An object with the state of the image