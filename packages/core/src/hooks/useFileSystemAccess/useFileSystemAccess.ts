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
  create: (createOptions?: UseFileSystemAccessShowSaveOptions) => Promise<void>;
  /** Open an existing file */
  open: (openOptions?: UseFileSystemAccessCommonOptions) => Promise<void>;
  /** Save to the current handle, or prompt with {@link saveAs} if none */
  save: (saveOptions?: UseFileSystemAccessShowSaveOptions) => Promise<void>;
  /** Always prompt for a file path then save */
  saveAs: (saveOptions?: UseFileSystemAccessShowSaveOptions) => Promise<void>;
  /** Set the data */
  set: (data: Data) => void;
  /** Re-read data from the current handle using `dataType` */
  update: () => Promise<void>;
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
    typeof window.showOpenFilePicker === 'function' &&
    typeof window.showSaveFilePicker === 'function';

  const dataType = options.dataType ?? 'Text';

  const handleRef = useRef<FileSystemFileHandle>(undefined);

  const [data, setData] = useState<string | ArrayBuffer | Blob>();
  const [file, setFile] = useState<File>();

  const load = async () => {
    const handle = handleRef.current;
    if (!handle) return;
    const file = await handle.getFile();
    setFile(file);

    if (dataType === 'Text') return setData(await file.text());
    if (dataType === 'ArrayBuffer') return setData(await file.arrayBuffer());
    if (dataType === 'Blob') return setData(file);
    throw new Error(`Invalid data type: ${dataType}`);
  };

  const open = async (params?: UseFileSystemAccessCommonOptions) => {
    if (!supported) return;
    const [handle] = await window.showOpenFilePicker({
      ...options,
      ...params
    });
    handleRef.current = handle;
    await load();
  };

  const create = async (params: UseFileSystemAccessShowSaveOptions = {}) => {
    if (!supported) return;
    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });
    setData(undefined);
    await load();
  };

  const saveAs = async (params?: UseFileSystemAccessShowSaveOptions) => {
    if (!supported) return;

    handleRef.current = await window.showSaveFilePicker({
      ...options,
      ...params
    });

    const writable = await handleRef.current.createWritable();
    await writable.write(data as Blob | BufferSource);
    await writable.close();

    await load();
  };

  const save = async (params?: UseFileSystemAccessShowSaveOptions) => {
    if (!supported) return;

    if (!handleRef.current) return saveAs(params);

    const writable = await handleRef.current.createWritable();
    await writable.write(data as Blob | BufferSource);
    await writable.close();

    await load();
  };

  const update = async () => {
    await load();
  };

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
