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

  const onPrev = () => setId((value) => Math.max(MIN_ID, value - 1));
  const onNext = () => setId((value) => Math.min(MAX_ID, value + 1));
  const onDownload = () => {
    if (!image.value) return;
    downloadImage(image.value, filename);
  };

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      <div className='bg-card relative flex h-[240px] items-center justify-center overflow-hidden rounded-xl shadow-sm'>
        {image.isLoading && (
          <div className='bg-card/70 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]'>
            <Loader2Icon className='text-muted-foreground size-8 animate-spin' />
          </div>
        )}

        {image.value && (
          <img
            alt={filename}
            className='animate-in fade-in h-[160px] object-contain duration-300'
            src={image.value.src}
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
          disabled={image.isLoading || !image.image}
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
import { useEffect, useState } from 'react';

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
export interface UseImageReturn {
  /** The image loading error */
  error?: Event;
  /** The error state of the image */
  isError: boolean;
  /** Is image loading? */
  isLoading: boolean;
  /** The success state of the image */
  isSuccess: boolean;
  /** The image element */
  value?: HTMLImageElement;
}

/**
 * @name useImage
 * @description - Hook that load an image in the browser
 * @category Elements
 * @usage low
 *
 * @browserapi Image https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
 *
 * @param {string} src The source of the image
 * @param {string} [options.srcset] The srcset of the image
 * @param {string} [options.sizes] The sizes of the image
 * @param {string} [options.alt] The alt of the image
 * @param {string} [options.class] The class of the image
 * @param {HTMLImageElement['loading']} [options.loading] The loading of the image
 * @param {string} [options.crossorigin] The crossorigin of the image
 * @param {HTMLImageElement['referrerPolicy']} [options.referrerPolicy] The referrerPolicy of the image
 * @returns {UseImageReturn} An object with the image loading state
 *
 * @example
 * const { value, isLoading, isError, isSuccess, error } = useImage('https://example.com/image.png');
 */
export const useImage = (src: string, options: UseImageOptions = {}): UseImageReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Event | undefined>(undefined);
  const [value, setValue] = useState<HTMLImageElement | undefined>(undefined);

  const { alt, class: className, crossorigin, loading, referrerPolicy, sizes, srcset } = options;

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(undefined);
    setValue(undefined);

    const image = new Image();

    if (alt) image.alt = alt;
    if (srcset) image.srcset = srcset;
    if (sizes) image.sizes = sizes;
    if (className) image.className = className;
    if (loading) image.loading = loading;
    if (crossorigin) image.crossOrigin = crossorigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;

    const onLoad = () => {
      setValue(image);
      setIsSuccess(true);
      setIsLoading(false);
      setError(undefined);
      setIsError(false);
    };

    const onError = (event: Event) => {
      setValue(undefined);
      setIsSuccess(false);
      setIsLoading(false);
      setError(event);
      setIsError(true);
    };

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);

    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) onLoad();
      else onError(new Event('error'));
    }

    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
  }, [alt, className, crossorigin, loading, referrerPolicy, sizes, src, srcset]);

  return {
    value,
    error,
    isLoading,
    isError,
    isSuccess
  };
};
```

Update the import paths to match your project setup.

## Usage

```tsx
const { value, isLoading, isError, isSuccess, error } = useImage('https://example.com/image.png');
```

## Type Declarations

```tsx
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

export interface UseImageReturn {
  /** The image loading error */
  error?: Event;
  /** The error state of the image */
  isError: boolean;
  /** Is image loading? */
  isLoading: boolean;
  /** The success state of the image */
  isSuccess: boolean;
  /** The image element */
  value?: HTMLImageElement;
}
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

### Returns

`UseImageReturn` - An object with the image loading state