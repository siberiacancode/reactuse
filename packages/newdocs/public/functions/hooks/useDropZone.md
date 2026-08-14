---
title: useDropZone
description: Hook that provides drop zone functionality
category: elements
usage: medium
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1773233253000
---

# useDropZone

Hook that provides drop zone functionality

## Demo

```tsx
import { useDropZone, useFileDialog } from '@siberiacancode/reactuse';
import { ImageIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/lib';

interface FilePreview {
  name: string;
  preview: string;
  size: number;
  type: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const Demo = () => {
  const [file, setFile] = useState<FilePreview | null>(null);

  const readFile = (source: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setFile({
        name: source.name,
        size: source.size,
        type: source.type,
        preview: event.target?.result as string
      });
    };
    reader.readAsDataURL(source);
  };

  const onDrop = (files: File[] | null) => {
    if (!files?.length) return;
    readFile(files[0]);
  };

  const fileDialog = useFileDialog(
    (files) => {
      if (!files?.length) return;
      readFile(files[0]);
    },
    {
      accept: 'image/*',
      multiple: false,
      reset: true
    }
  );

  const onPick = () => fileDialog.open();
  const onRemove = () => setFile(null);

  const dropZone = useDropZone<HTMLDivElement>({
    dataTypes: ['image'],
    onDrop
  });

  return (
    <section className='flex w-full max-w-md flex-col p-4'>
      {!file && (
        <div
          ref={dropZone.ref}
          className={cn(
            'flex h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 transition-colors',
            dropZone.overed
              ? 'border-foreground bg-accent/30'
              : 'border-border bg-card hover:bg-accent/20'
          )}
          onClick={onPick}
        >
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-full transition-colors',
              dropZone.overed ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
            )}
          >
            <UploadCloudIcon className='size-6' />
          </div>

          <div className='flex flex-col items-center gap-1 text-center'>
            <p className='text-foreground text-sm font-medium'>
              {dropZone.overed && 'Drop image here'}
              {!dropZone.overed && (
                <>
                  <span className='underline'>Click to upload</span> or drag and drop
                </>
              )}
            </p>
            <p className='text-muted-foreground text-xs'>PNG, JPG or GIF up to 10MB</p>
          </div>
        </div>
      )}

      {file && (
        <div className='border-border bg-card relative h-[220px] overflow-hidden rounded-xl border shadow-sm'>
          <img
            aria-hidden
            className='absolute inset-0 size-full scale-110 object-cover blur-2xl'
            src={file.preview}
          />

          <div className='relative flex size-full flex-col justify-between'>
            <div className='flex size-full items-center justify-center'>
              <img
                alt={file.name}
                className='h-[140px] rounded-md object-contain'
                src={file.preview}
              />
            </div>

            <div className='flex w-full items-center gap-3 bg-black/40 px-3 py-2'>
              <div className='flex size-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-white'>
                <ImageIcon className='size-3.5' />
              </div>

              <div className='flex min-w-0 flex-1 flex-col leading-tight'>
                <span className='truncate text-xs font-medium text-white'>{file.name}</span>
                <span className='text-[10px] text-white/70 tabular-nums'>
                  {formatSize(file.size)} - {file.type.replace('image/', '').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            aria-label='Remove'
            className='absolute top-2 right-2'
            data-size='icon'
            data-variant='secondary'
            type='button'
            onClick={onRemove}
          >
            <XIcon className='size-4' />
          </button>
        </div>
      )}
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
npx useverse@latest add useDropZone
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useEffect, useRef, useState } from 'react';

import type { HookTarget } from '@/utils/helpers';

import { isTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

import { useRefState } from '../useRefState/useRefState';

export type DropZoneDataTypes = ((types: string[]) => boolean) | string[];

export interface UseDropZoneOptions {
  /** The data types for drop zone */
  dataTypes?: DropZoneDataTypes;
  /** The multiple mode for drop zone */
  multiple?: boolean;
  /** The on drop callback */
  onDrop?: (files: File[] | null, event: DragEvent) => void;
  /** The on enter callback */
  onEnter?: (event: DragEvent) => void;
  /** The on leave callback */
  onLeave?: (event: DragEvent) => void;
  /** The on over callback */
  onOver?: (event: DragEvent) => void;
}

export interface UseDropZoneReturn {
  /** The files that was dropped in drop zone */
  files: File[] | null;
  /** The over drop zone status */
  overed: boolean;
}

export interface UseDropZone {
  (
    target: HookTarget,
    callback?: (files: File[] | null, event: DragEvent) => void
  ): UseDropZoneReturn;

  <Target extends Element>(
    callback?: (files: File[] | null, event: DragEvent) => void,
    target?: never
  ): UseDropZoneReturn & {
    ref: StateRef<Target>;
  };

  (target: HookTarget, options?: UseDropZoneOptions): UseDropZoneReturn;

  <Target extends Element>(
    options?: UseDropZoneOptions,
    target?: never
  ): UseDropZoneReturn & {
    ref: StateRef<Target>;
  };
}

/**
 * @name useDropZone
 * @description - Hook that provides drop zone functionality
 * @category Elements
 * @usage medium

 * @overload
 * @template Target The target element
 * @param {Target} target The target element drop zone's
 * @param {DataTypes} [options.dataTypes] The data types
 * @param {boolean} [options.multiple] The multiple mode
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onDrop] The on drop callback function
 * @param {(event: DragEvent) => void} [options.onEnter] The on enter callback function
 * @param {(event: DragEvent) => void} [options.onLeave] The on leave callback function
 * @param {(event: DragEvent) => void} [options.onOver] The on over callback function
 * @returns {UseDropZoneReturn} The object with drop zone states
 *
 * @example
 * const { overed, files } = useDropZone(ref, options);
 *
 * @overload
 * @param {Target} target The target element drop zone's
 * @param {(files: File[] | null, event: DragEvent) => void} [callback] The callback function to be invoked on drop
 * @returns {UseDropZoneReturn} The object with drop zone states
 *
 * @example
 * const { overed, files } = useDropZone(ref, () => console.log('callback'));
 *
 * @overload
 * @param {DataTypes} [options.dataTypes] The data types
 * @param {boolean} [options.multiple] The multiple mode
 * @param {(files: File[] | null, event: DragEvent) => void} [options.onDrop] The on drop callback function
 * @param {(event: DragEvent) => void} [options.onEnter] The on enter callback function
 * @param {(event: DragEvent) => void} [options.onLeave] The on leave callback function
 * @param {(event: DragEvent) => void} [options.onOver] The on over callback function
 * @returns {UseDropZoneReturn & { ref: StateRef<Target> }} The object with drop zone states and ref
 *
 * @example
 * const { ref, overed, files } = useDropZone(options);
 *
 * @overload
 * @param {(files: File[] | null, event: DragEvent) => void} [callback] The callback function to be invoked on drop
 * @returns {UseDropZoneReturn & { ref: StateRef<Target> }} The object with drop zone states and ref
 *
 * @example
 * const { ref, overed, files } = useDropZone(() => console.log('callback'));
 */
export const useDropZone = ((...params: any[]) => {
  const target = (isTarget(params[0]) ? params[0] : undefined) as HookTarget | undefined;

  const options = (
    target
      ? typeof params[1] === 'object'
        ? params[1]
        : { onDrop: params[1] }
      : typeof params[0] === 'object'
        ? params[0]
        : { onDrop: params[0] }
  ) as UseDropZoneOptions;

  const internalRef = useRefState<Element>();

  const counterRef = useRef(0);
  const [files, setFiles] = useState<File[] | null>(null);
  const [overed, setOvered] = useState(false);

  const dataTypes = options.dataTypes;

  const getFiles = (event: DragEvent) => {
    if (!event.dataTransfer) return null;
    const list = [...event.dataTransfer.files];
    if (options.multiple) return list;
    if (!list.length) return null;
    return [list[0]];
  };

  const checkDataTypes = (types: string[]) => {
    if (!dataTypes) return true;
    if (typeof dataTypes === 'function') return dataTypes(types);
    if (!dataTypes.length) return true;
    if (!types.length) return false;

    return types.every((type) => dataTypes.some((dataType) => type.includes(dataType)));
  };

  const checkValidity = (items: DataTransferItemList) => {
    const types = Array.from(items, (item) => item.type);
    const dataTypesValid = checkDataTypes(types);
    const multipleFilesValid = options.multiple || items.length <= 1;

    return dataTypesValid && multipleFilesValid;
  };

  useEffect(() => {
    if (!target && !internalRef.state) return;

    const element = target ? isTarget.getElement(target) : internalRef.current;

    if (!element) return;

    const onEvent = (event: DragEvent) => {
      if (!event.dataTransfer) return;

      const isValid = checkValidity(event.dataTransfer.items);
      if (!isValid) {
        event.dataTransfer.dropEffect = 'none';
        return;
      }

      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';

      const currentFiles = getFiles(event);

      if (event.type === 'drop') {
        counterRef.current = 0;
        setOvered(false);
        setFiles(currentFiles);
        options.onDrop?.(currentFiles, event);
        return;
      }

      if (event.type === 'dragenter') {
        counterRef.current += 1;
        setOvered(true);
        options.onEnter?.(event);
        return;
      }

      if (event.type === 'dragleave') {
        counterRef.current -= 1;
        if (counterRef.current !== 0) return;
        setOvered(false);
        options.onLeave?.(event);
        return;
      }

      if (event.type === 'dragover') options.onOver?.(event);
    };

    element.addEventListener('dragenter', onEvent as EventListener);
    element.addEventListener('dragover', onEvent as EventListener);
    element.addEventListener('dragleave', onEvent as EventListener);
    element.addEventListener('drop', onEvent as EventListener);

    return () => {
      element.removeEventListener('dragenter', onEvent as EventListener);
      element.removeEventListener('dragover', onEvent as EventListener);
      element.removeEventListener('dragleave', onEvent as EventListener);
      element.removeEventListener('drop', onEvent as EventListener);
    };
  }, [target && isTarget.getRawElement(target), internalRef.state]);

  if (target) return { overed, files };
  return { ref: internalRef, overed, files };
}) as UseDropZone;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { overed, files } = useDropZone(ref, options);
// or
const { overed, files } = useDropZone(ref, () => console.log('callback'));
// or
const { ref, overed, files } = useDropZone(options);
// or
const { ref, overed, files } = useDropZone(() => console.log('callback'));
```

## Type Declarations

```tsx
import type { HookTarget } from '@/utils/helpers';

import type { StateRef } from '../useRefState/useRefState';

export type DropZoneDataTypes = ((types: string[]) => boolean) | string[];

export interface UseDropZoneOptions {
  /** The data types for drop zone */
  dataTypes?: DropZoneDataTypes;
  /** The multiple mode for drop zone */
  multiple?: boolean;
  /** The on drop callback */
  onDrop?: (files: File[] | null, event: DragEvent) => void;
  /** The on enter callback */
  onEnter?: (event: DragEvent) => void;
  /** The on leave callback */
  onLeave?: (event: DragEvent) => void;
  /** The on over callback */
  onOver?: (event: DragEvent) => void;
}

export interface UseDropZoneReturn {
  /** The files that was dropped in drop zone */
  files: File[] | null;
  /** The over drop zone status */
  overed: boolean;
}

export interface UseDropZone {
  (
    target: HookTarget,
    callback?: (files: File[] | null, event: DragEvent) => void
  ): UseDropZoneReturn;

  <Target extends Element>(
    callback?: (files: File[] | null, event: DragEvent) => void,
    target?: never
  ): UseDropZoneReturn & {
    ref: StateRef<Target>;
  };

  (target: HookTarget, options?: UseDropZoneOptions): UseDropZoneReturn;

  <Target extends Element>(
    options?: UseDropZoneOptions,
    target?: never
  ): UseDropZoneReturn & {
    ref: StateRef<Target>;
  };
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `Target` | - | The target element drop zone's |
| options.dataTypes | `DataTypes` | - | The data types |
| options.multiple | `boolean` | - | The multiple mode |
| options.onDrop | `(files: File[] \| null, event: DragEvent) => void` | - | The on drop callback function |
| options.onEnter | `(event: DragEvent) => void` | - | The on enter callback function |
| options.onLeave | `(event: DragEvent) => void` | - | The on leave callback function |
| options.onOver | `(event: DragEvent) => void` | - | The on over callback function |

#### Returns

`UseDropZoneReturn` - The object with drop zone states

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| target | `Target` | - | The target element drop zone's |
| callback | `(files: File[] \| null, event: DragEvent) => void` | - | The callback function to be invoked on drop |

#### Returns

`UseDropZoneReturn` - The object with drop zone states

### Overload 3

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.dataTypes | `DataTypes` | - | The data types |
| options.multiple | `boolean` | - | The multiple mode |
| options.onDrop | `(files: File[] \| null, event: DragEvent) => void` | - | The on drop callback function |
| options.onEnter | `(event: DragEvent) => void` | - | The on enter callback function |
| options.onLeave | `(event: DragEvent) => void` | - | The on leave callback function |
| options.onOver | `(event: DragEvent) => void` | - | The on over callback function |

#### Returns

`UseDropZoneReturn & { ref: StateRef<Target> }` - The object with drop zone states and ref

### Overload 4

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(files: File[] \| null, event: DragEvent) => void` | - | The callback function to be invoked on drop |

#### Returns

`UseDropZoneReturn & { ref: StateRef<Target> }` - The object with drop zone states and ref