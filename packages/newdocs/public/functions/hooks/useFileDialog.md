---
title: useFileDialog
description: Hook to handle file input
category: elements
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1779722441000
---

# useFileDialog

Hook to handle file input

## Demo

```tsx
import { useClickOutside, useDisclosure, useField, useFileDialog } from '@siberiacancode/reactuse';
import {
  FileImageIcon,
  FileTextIcon,
  PaperclipIcon,
  SendHorizontalIcon,
  XIcon
} from 'lucide-react';
import { useState } from 'react';

const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.txt', '.doc', '.docx', '.zip', 'json', 'yaml'];

const isAllowedFile = (fileName: string) => {
  const normalizedFileName = fileName.toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension));
};

const ATTACHMENT_ICONS = {
  image: FileImageIcon,
  file: FileTextIcon
};

const Demo = () => {
  const attachMenu = useDisclosure();
  const attachMenuRef = useClickOutside<HTMLDivElement>(() => attachMenu.close());

  const toField = useField('siberiacancode@reactuse.org');
  const subjectField = useField('Improve Reactuse documentation 🚀');
  const messageField = useField(
    'Added examples and notes for the docs update.\n\nLet us improve Reactuse documentation.'
  );

  const [attachments, setAttachments] = useState<File[]>([]);

  const addImageAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    const nextFiles = [...files].filter((file) => file.type.startsWith('image/'));
    if (!nextFiles.length) return;
    setAttachments((prevFiles) => [...prevFiles, ...nextFiles]);
  };

  const addFileAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    const nextFiles = [...files].filter((file) => isAllowedFile(file.name));
    if (!nextFiles.length) return;
    setAttachments((prevFiles) => [...prevFiles, ...nextFiles]);
  };

  const imageDialog = useFileDialog(addImageAttachments, {
    multiple: true,
    accept: 'image/*',
    reset: true
  });

  const fileDialog = useFileDialog(addFileAttachments, {
    multiple: true,
    accept: '.pdf,.txt,.doc,.docx,.zip,.json,.yaml',
    reset: true
  });

  const onRemoveAttachment = (index: number) =>
    setAttachments((prevFiles) => prevFiles.filter((_, fileIndex) => fileIndex !== index));

  return (
    <section className='flex w-full max-w-xl flex-col'>
      <div className='bg-card flex flex-col gap-3 overflow-hidden rounded-2xl p-4 shadow-sm'>
        <h3 className='text-sm font-semibold'>Compose</h3>

        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground w-14 shrink-0 text-xs'>To</span>
          <input
            className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none'
            placeholder='you@example.com'
            {...toField.register()}
          />
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground w-14 shrink-0 text-xs'>Subject</span>
          <input
            className='text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none'
            id='subject'
            placeholder='Write a clear subject'
            {...subjectField.register()}
          />
        </div>

        <textarea
          className='text-foreground placeholder:text-muted-foreground no-scrollbar min-h-[140px] w-full resize-none bg-transparent text-sm leading-relaxed outline-none'
          id='description'
          placeholder='Add your message...'
          rows={8}
          {...messageField.register()}
        />

        {!!attachments.length && (
          <div className='flex flex-wrap gap-2'>
            {attachments.map((file, index) => {
              const Icon = ATTACHMENT_ICONS[file.type.startsWith('image/') ? 'image' : 'file'];

              return (
                <div
                  key={`${file.name}-${index}`}
                  className='border-border bg-muted/60 flex w-full max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-xs md:w-auto'
                >
                  <Icon className='text-muted-foreground size-3.5 shrink-0' />
                  <span className='max-w-44 truncate'>{file.name}</span>
                  <button
                    aria-label={`Remove ${file.name}`}
                    className='text-muted-foreground hover:text-foreground inline-flex items-center justify-center'
                    data-variant='ghost'
                    type='button'
                    onClick={() => onRemoveAttachment(index)}
                  >
                    <XIcon className='size-3.5' />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className='bg-card/80 flex items-center justify-between'>
          <div ref={attachMenuRef} className='relative'>
            <button data-variant='ghost' type='button' onClick={() => attachMenu.toggle()}>
              <PaperclipIcon className='size-4' />
              Attach
            </button>

            {attachMenu.opened && (
              <div
                className='absolute bottom-11 left-0 z-10 w-44'
                data-slot='dropdown-menu-content'
              >
                <div
                  data-slot='dropdown-menu-item'
                  onClick={() => {
                    imageDialog.open();
                    attachMenu.close();
                  }}
                >
                  <FileImageIcon />
                  Image
                </div>
                <div
                  data-slot='dropdown-menu-item'
                  onClick={() => {
                    fileDialog.open();
                    attachMenu.close();
                  }}
                >
                  <FileTextIcon />
                  File
                </div>
              </div>
            )}
          </div>

          <button type='button'>
            <SendHorizontalIcon className='size-4' />
            Send
          </button>
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
npx useverse@latest add useFileDialog
```

### Manual

Copy and paste the following code into your project.

```tsx
import type { ComponentProps } from 'react';

import { useEffect, useRef, useState } from 'react';

/* The use file dialog options */
export interface UseFileDialogOptions extends Pick<ComponentProps<'input'>, 'accept' | 'multiple'> {
  /** The capture value */
  capture?: string;
  /** The reset value */
  reset?: boolean;
}

const DEFAULT_OPTIONS = {
  multiple: true,
  accept: '*',
  reset: false
} satisfies UseFileDialogOptions;

/* The use file dialog return type */
export interface UseFileDialogReturn {
  /** The selected files */
  value: FileList | null;
  /** The open function */
  open: (openParams?: UseFileDialogOptions) => void;
  /** The reset function */
  reset: () => void;
}

export interface UseFileDialog {
  (
    callback?: (value: FileList | null) => void,
    options?: UseFileDialogOptions
  ): UseFileDialogReturn;

  (options?: UseFileDialogOptions, callback?: never): UseFileDialogReturn;
}

/**
 * @name useFileDialog
 * @description - Hook to handle file input
 * @category Elements
 * @usage low
 *
 * @overload
 * @param {(value: FileList | null) => void} callback The callback to execute when a file is selected
 * @param {boolean} [options.multiple=true] Whether multiple files can be selected
 * @param {string} [options.accept='*'] The accepted file types
 * @param {boolean} [options.reset=false] Whether the input should be reset when the callback is called
 * @param {string} [options.capture] The capture value
 * @returns {UseFileDialogReturn} An object containing the selected files
 *
 * @example
 * const { values, open, reset } = useFileDialog((value) => console.log(value));
 *
 * @overload
 * @param {boolean} [options.multiple=true] Whether multiple files can be selected
 * @param {string} [options.accept='*'] The accepted file types
 * @param {boolean} [options.reset=false] Whether the input should be reset when the callback is called
 * @param {string} [options.capture] The capture value
 * @returns {UseFileDialogReturn} An object containing the selected files
 *
 * @example
 * const { values, open, reset } = useFileDialog({ accept: 'image/*' });
 */
export const useFileDialog = ((...params: any[]) => {
  const callback = (typeof params[0] === 'function' ? params[0] : undefined) as
    | ((value: FileList | null) => void)
    | undefined;
  const options = (callback ? params[1] : params[0]) as UseFileDialogOptions | undefined;

  const [value, setValue] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const internalCallbackRef = useRef(callback);
  internalCallbackRef.current = callback;

  const reset = () => {
    setValue(null);
    internalCallbackRef.current?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const open = (openParams?: UseFileDialogOptions) => {
    if (!inputRef.current) return;

    inputRef.current.multiple =
      openParams?.multiple ?? options?.multiple ?? DEFAULT_OPTIONS.multiple;
    inputRef.current.accept = openParams?.accept ?? options?.accept ?? DEFAULT_OPTIONS.accept;

    const capture = openParams?.capture ?? options?.capture;
    if (capture) inputRef.current.capture = capture;

    if (openParams?.reset ?? options?.reset ?? DEFAULT_OPTIONS.reset) reset();

    inputRef.current.click();
  };

  useEffect(() => {
    const init = () => {
      const input = document.createElement('input');
      input.type = 'file';

      input.onchange = (event: Event) => {
        const { files } = event.target as HTMLInputElement;
        setValue(files);
        internalCallbackRef.current?.(files);
      };
      return input;
    };

    inputRef.current = init();
    return () => {
      if (!inputRef.current) return;
      inputRef.current.remove();
    };
  }, []);

  return { value, open, reset };
}) as UseFileDialog;
```

Update the import paths to match your project setup.

## Usage

```tsx
const { values, open, reset } = useFileDialog((value) => console.log(value));
// or
const { values, open, reset } = useFileDialog({ accept: 'image/*' });
```

## Type Declarations

```tsx
import type { ComponentProps } from 'react';

export interface UseFileDialogOptions extends Pick<ComponentProps<'input'>, 'accept' | 'multiple'> {
  /** The capture value */
  capture?: string;
  /** The reset value */
  reset?: boolean;
}

export interface UseFileDialogReturn {
  /** The selected files */
  value: FileList | null;
  /** The open function */
  open: (openParams?: UseFileDialogOptions) => void;
  /** The reset function */
  reset: () => void;
}

export interface UseFileDialog {
  (
    callback?: (value: FileList | null) => void,
    options?: UseFileDialogOptions
  ): UseFileDialogReturn;

  (options?: UseFileDialogOptions, callback?: never): UseFileDialogReturn;
}
```

## API

### Overload 1

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| callback | `(value: FileList \| null) => void` | - | The callback to execute when a file is selected |
| options.multiple | `boolean` | true | Whether multiple files can be selected |
| options.accept | `string` | '*' | The accepted file types |
| options.reset | `boolean` | false | Whether the input should be reset when the callback is called |
| options.capture | `string` | - | The capture value |

#### Returns

`UseFileDialogReturn` - An object containing the selected files

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options.multiple | `boolean` | true | Whether multiple files can be selected |
| options.accept | `string` | '*' | The accepted file types |
| options.reset | `boolean` | false | Whether the input should be reset when the callback is called |
| options.capture | `string` | - | The capture value |

#### Returns

`UseFileDialogReturn` - An object containing the selected files