---
title: useFileSystemAccess
description: Hook for reading and writing local files via the File System Access API
category: browser
usage: low
type: hook
isTest: true
isDemo: true
lastModifiedTime: 1781981977000
---

# useFileSystemAccess

Hook for reading and writing local files via the File System Access API

## Demo

```tsx
import type { MouseEvent } from 'react';

import {
  useBoolean,
  useClickOutside,
  useField,
  useFileSystemAccess
} from '@siberiacancode/reactuse';
import { FileTextIcon, ReplaceIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const Demo = () => {
  const fileSystemAccess = useFileSystemAccess({
    dataType: 'Text',
    types: [
      {
        description: 'Text',
        accept: { 'text/plain': ['.txt'] }
      },
      {
        description: 'Markdown',
        accept: { 'text/markdown': ['.md', '.markdown'] }
      }
    ]
  });

  const findField = useField('');
  const replaceField = useField('');
  const [findOpen, toggleFindOpen] = useBoolean(false);
  const [content, setContent] = useState('');

  const findPanelRef = useClickOutside<HTMLDivElement>(() => {
    if (findOpen) toggleFindOpen(false);
  });

  if (!fileSystemAccess.supported)
    return (
      <p>
        API not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API'
          rel='noreferrer'
          target='_blank'
        >
          API
        </a>
      </p>
    );

  const find = findField.watch();
  const replace = replaceField.watch();
  const matches = find ? content.split(find).length - 1 : 0;
  const dirty = !!fileSystemAccess.file && content !== fileSystemAccess.data;

  const onSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await fileSystemAccess.save();
    setContent(fileSystemAccess.data ?? '');
  };

  const onOpen = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const data = await fileSystemAccess.open();
    setContent(data);
  };

  const onReplaceAll = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!find || !matches) return;
    const updated = content.split(find).join(replace);
    fileSystemAccess.set(updated);
    findField.setValue('');
    replaceField.setValue('');
  };

  return (
    <section className='flex w-full max-w-2xl flex-col p-4'>
      <div className='border-border bg-card relative flex h-[280px] flex-col overflow-hidden rounded-xl border shadow-sm'>
        {!fileSystemAccess.file && (
          <div className='flex size-full flex-col items-center justify-center gap-3 p-6'>
            <div className='bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full'>
              <FileTextIcon className='size-6' />
            </div>
            <div className='flex flex-col items-center gap-1 text-center'>
              <p className='text-foreground text-sm font-medium'>No file opened</p>
              <p className='text-muted-foreground text-xs'>
                Open a .txt or .md file to start editing
              </p>
            </div>
            <button data-size='sm' type='button' onClick={onOpen}>
              Open file
            </button>
          </div>
        )}

        {fileSystemAccess.file && (
          <>
            <div className='border-border bg-muted/40 flex shrink-0 items-center gap-2 border-b px-3 py-2'>
              <div className='bg-card flex size-6 shrink-0 items-center justify-center'>
                <FileTextIcon className='text-muted-foreground size-3' />
              </div>
              <span className='text-foreground min-w-0 flex-1 truncate text-xs font-medium'>
                {fileSystemAccess.name}
              </span>

              <div className='flex items-center gap-1'>
                <button
                  aria-label='Find and replace'
                  data-size='icon-sm'
                  data-variant='ghost'
                  type='button'
                  onClick={() => toggleFindOpen()}
                >
                  <ReplaceIcon className='size-3.5' />
                </button>
                <button data-size='sm' disabled={!dirty} type='button' onClick={onSave}>
                  Save
                </button>
              </div>
            </div>

            <textarea
              className='no-scrollbar text-foreground flex-1 resize-none rounded-none! border-none! bg-transparent p-3 font-mono text-xs shadow-none! ring-0! outline-none!'
              value={fileSystemAccess.data}
              onChange={(event) => fileSystemAccess.set(event.target.value)}
            />

            {findOpen && (
              <div
                ref={findPanelRef}
                className='border-border bg-card absolute top-12 right-3 z-20 flex w-[240px] flex-col gap-3 rounded-xl border p-3 shadow-lg'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-foreground text-[11px] font-medium'>Find and replace</span>
                  <button
                    aria-label='Close'
                    data-size='icon'
                    data-variant='ghost'
                    type='button'
                    onClick={() => toggleFindOpen()}
                  >
                    <XIcon className='size-3' />
                  </button>
                </div>

                <div className='flex flex-col gap-2'>
                  <input
                    autoFocus
                    className='border-border bg-background text-foreground rounded-md border px-2.5 py-1.5 text-[11px] outline-none'
                    placeholder='Find'
                    {...findField.register()}
                  />
                  <div className='relative'>
                    <input
                      className='border-border bg-background text-foreground w-full rounded-md border px-2.5 py-1.5 pr-8 text-[11px] outline-none'
                      placeholder='Replace with'
                      {...replaceField.register()}
                    />
                    <button
                      aria-label='Replace all'
                      className='absolute top-1/2 right-1 -translate-y-1/2'
                      data-size='icon-xs'
                      data-variant='ghost'
                      disabled={!find || !matches}
                      type='button'
                      onClick={onReplaceAll}
                    >
                      <ReplaceIcon className='size-3' />
                    </button>
                  </div>
                </div>

                {!!find && (
                  <span className='text-muted-foreground font-mono text-[10px] tabular-nums'>
                    {matches} {matches === 1 ? 'match' : 'matches'}
                  </span>
                )}
              </div>
            )}
          </>
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
npx useverse@latest add useFileSystemAccess
```

### Manual

Copy and paste the following code into your project.

```tsx
import { useRef, useState } from 'react';

export interface FileSystemAccessShowOpenFileOptions {
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

export interface FileSystemAccessShowSaveFileOptions {
  excludeAcceptAllOption?: boolean;
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

export interface FileSystemFileHandle {
  createWritable: () => Promise<FileSystemWritableFileStream>;
  getFile: () => Promise<File>;
}

export interface FileSystemWritableFileStream extends WritableStream {
  write: FileSystemWritableFileStreamWrite;
  seek: (position: number) => Promise<void>;
  truncate: (size: number) => Promise<void>;
}

export interface FileSystemWritableFileStreamWrite {
  (data: string | Blob | BufferSource): Promise<void>;
  (options: { type: 'write'; position: number; data: string | Blob | BufferSource }): Promise<void>;
  (options: { type: 'seek'; position: number }): Promise<void>;
  (options: { type: 'truncate'; size: number }): Promise<void>;
}

declare global {
  interface Window {
    readonly showOpenFilePicker: (
      options?: FileSystemAccessShowOpenFileOptions
    ) => Promise<FileSystemFileHandle[]>;
    readonly showSaveFilePicker: (
      options?: FileSystemAccessShowSaveFileOptions
    ) => Promise<FileSystemFileHandle>;
  }
}

/** The use file system access common options type */
export type UseFileSystemAccessCommonOptions = Pick<
  FileSystemAccessShowOpenFileOptions,
  'excludeAcceptAllOption' | 'types'
>;

/** The use file system access show save options type */
export type UseFileSystemAccessShowSaveOptions = Pick<
  FileSystemAccessShowSaveFileOptions,
  'suggestedName'
>;

/** The use file system access options type */
export type UseFileSystemAccessOptions = UseFileSystemAccessCommonOptions & {
  dataType?: 'ArrayBuffer' | 'Blob' | 'Text';
};

/** The use file system access return type */
export interface UseFileSystemAccessReturn<Data = string | ArrayBuffer | Blob> {
  /** Last read data */
  data?: Data;
  /** Current file */
  file?: File;
  /** Last modified timestamp */
  lastModified: number;
  /** File base name */
  name: string;
  /** Size in bytes */
  size: number;
  /** Whether the File System Access API is available */
  supported: boolean;
  /** MIME type */
  type: string;
  /** Create a new file via save picker */
  create: (createOptions?: UseFileSystemAccessShowSaveOptions) => Promise<Data>;
  /** Open an existing file */
  open: (openOptions?: UseFileSystemAccessCommonOptions) => Promise<Data>;
  /** Save to the current handle, or prompt with {@link saveAs} if none */
  save: (saveOptions?: UseFileSystemAccessShowSaveOptions) => Promise<Data>;
  /** Always prompt for a file path then save */
  saveAs: (saveOptions?: UseFileSystemAccessShowSaveOptions) => Promise<Data>;
  /** Set the data */
  set: (data: Data) => void;
  /** Re-read data from the current handle using `dataType` */
  update: () => Promise<Data>;
}

export interface UseFileSystemAccess {
  (): UseFileSystemAccessReturn<string | ArrayBuffer | Blob>;
  (
    options: UseFileSystemAccessOptions & { dataType: 'ArrayBuffer' }
  ): UseFileSystemAccessReturn<ArrayBuffer>;
  (options: UseFileSystemAccessOptions & { dataType: 'Blob' }): UseFileSystemAccessReturn<Blob>;
  (options: UseFileSystemAccessOptions & { dataType: 'Text' }): UseFileSystemAccessReturn<string>;
  (options?: UseFileSystemAccessOptions): UseFileSystemAccessReturn<string | ArrayBuffer | Blob>;
}

/**
 * @name useFileSystemAccess
 * @description - Hook for reading and writing local files via the File System Access API
 * @category Browser
 * @usage low
 *
 * @browserapi File System Access API https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
 *
 * @overload
 * @returns {UseFileSystemAccessReturn<string | ArrayBuffer | Blob>}
 *
 * @overload
 * @param {UseFileSystemAccessOptions} [options]
 * @returns {UseFileSystemAccessReturn}
 *
 * @example
 * const fileSystemAccess = useFileSystemAccess({ dataType: 'Text' });
 */
export const useFileSystemAccess = ((
  options: UseFileSystemAccessOptions = {}
): UseFileSystemAccessReturn<string | ArrayBuffer | Blob> => {
  const supported =
    typeof window !== 'undefined' &&
    'showOpenFilePicker' in window &&
    'showSaveFilePicker' in window &&
    !!window.showOpenFilePicker &&
    !!window.showSaveFilePicker;

  const dataType = options.dataType ?? 'Text';

  const handleRef = useRef<FileSystemFileHandle>(undefined);

  const [data, setData] = useState<string | ArrayBuffer | Blob>();
  const [file, setFile] = useState<File>();

  const load = async () => {
    const handle = handleRef.current;
    if (!handle) throw new Error('No file handle');
    const file = await handle.getFile();
    setFile(file);

    const actionMap = {
      Text: () => file.text(),
      ArrayBuffer: () => file.arrayBuffer(),
      Blob: () => file
    };

    const data = await actionMap[dataType]();
    setData(data);
    return data;
  };

  const open = async (params?: UseFileSystemAccessCommonOptions) => {
    const [handle] = await window.showOpenFilePicker({
      ...options,
      ...params
    });
    handleRef.current = handle;
    return load();
  };

  const create = async (params: UseFileSystemAccessShowSaveOptions = {}) => {
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });
    setData(undefined);
    return load();
  };

  const saveAs = async (params?: UseFileSystemAccessShowSaveOptions) => {
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });

    const writable = await handleRef.current.createWritable();
    await writable.write(data as Blob | BufferSource);
    await writable.close();

    return load();
  };

  const save = async (params?: UseFileSystemAccessShowSaveOptions) => {
    if (!handleRef.current) return saveAs(params);

    const writable = await handleRef.current.createWritable();
    await writable.write(data as Blob | BufferSource);
    await writable.close();

    return load();
  };

  const update = load;

  const set = (data: string | ArrayBuffer | Blob) => setData(data);

  return {
    supported,
    data,
    file,
    name: file?.name ?? '',
    type: file?.type ?? '',
    size: file?.size ?? 0,
    lastModified: file?.lastModified ?? 0,
    open,
    set,
    create,
    save,
    saveAs,
    update
  };
}) as UseFileSystemAccess;
```

Update the import paths to match your project setup.

## Usage

```tsx
const fileSystemAccess = useFileSystemAccess({ dataType: 'Text' });
```

## Type Declarations

```tsx
export interface FileSystemAccessShowOpenFileOptions {
  excludeAcceptAllOption?: boolean;
  multiple?: boolean;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

export interface FileSystemAccessShowSaveFileOptions {
  excludeAcceptAllOption?: boolean;
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
}

export interface FileSystemFileHandle {
  createWritable: () => Promise<FileSystemWritableFileStream>;
  getFile: () => Promise<File>;
}

export interface FileSystemWritableFileStream extends WritableStream {
  write: FileSystemWritableFileStreamWrite;
  seek: (position: number) => Promise<void>;
  truncate: (size: number) => Promise<void>;
}

export interface FileSystemWritableFileStreamWrite {
  (data: string | Blob | BufferSource): Promise<void>;
  (options: { type: 'write'; position: number; data: string | Blob | BufferSource }): Promise<void>;
  (options: { type: 'seek'; position: number }): Promise<void>;
  (options: { type: 'truncate'; size: number }): Promise<void>;
}

interface Window {
    readonly showOpenFilePicker: (
      options?: FileSystemAccessShowOpenFileOptions
    ) => Promise<FileSystemFileHandle[]>;
    readonly showSaveFilePicker: (
      options?: FileSystemAccessShowSaveFileOptions
    ) => Promise<FileSystemFileHandle>;
  }

export type UseFileSystemAccessCommonOptions = Pick<
  FileSystemAccessShowOpenFileOptions,
  'excludeAcceptAllOption' | 'types'
>;

export type UseFileSystemAccessShowSaveOptions = Pick<
  FileSystemAccessShowSaveFileOptions,
  'suggestedName'
>;

export type UseFileSystemAccessOptions = UseFileSystemAccessCommonOptions & {
  dataType?: 'ArrayBuffer' | 'Blob' | 'Text';
};

export interface UseFileSystemAccessReturn<Data = string | ArrayBuffer | Blob> {
  /** Last read data */
  data?: Data;
  /** Current file */
  file?: File;
  /** Last modified timestamp */
  lastModified: number;
  /** File base name */
  name: string;
  /** Size in bytes */
  size: number;
  /** Whether the File System Access API is available */
  supported: boolean;
  /** MIME type */
  type: string;
  /** Create a new file via save picker */
  create: (createOptions?: UseFileSystemAccessShowSaveOptions) => Promise<Data>;
  /** Open an existing file */
  open: (openOptions?: UseFileSystemAccessCommonOptions) => Promise<Data>;
  /** Save to the current handle, or prompt with {@link saveAs} if none */
  save: (saveOptions?: UseFileSystemAccessShowSaveOptions) => Promise<Data>;
  /** Always prompt for a file path then save */
  saveAs: (saveOptions?: UseFileSystemAccessShowSaveOptions) => Promise<Data>;
  /** Set the data */
  set: (data: Data) => void;
  /** Re-read data from the current handle using `dataType` */
  update: () => Promise<Data>;
}

export interface UseFileSystemAccess {
  (): UseFileSystemAccessReturn<string | ArrayBuffer | Blob>;
  (
    options: UseFileSystemAccessOptions & { dataType: 'ArrayBuffer' }
  ): UseFileSystemAccessReturn<ArrayBuffer>;
  (options: UseFileSystemAccessOptions & { dataType: 'Blob' }): UseFileSystemAccessReturn<Blob>;
  (options: UseFileSystemAccessOptions & { dataType: 'Text' }): UseFileSystemAccessReturn<string>;
  (options?: UseFileSystemAccessOptions): UseFileSystemAccessReturn<string | ArrayBuffer | Blob>;
}
```

## API

### Overload 1

#### Returns

`UseFileSystemAccessReturn<string | ArrayBuffer | Blob>`

### Overload 2

#### Parameters

| Name | Type | Default | Note |
| --- | --- | --- | --- |
| options | `UseFileSystemAccessOptions` | - | - |

#### Returns

`UseFileSystemAccessReturn`