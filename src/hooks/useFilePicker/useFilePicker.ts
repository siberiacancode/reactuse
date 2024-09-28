import type { ChangeEvent } from 'react';
import { useState } from 'react';

/* The use file picker options */
export interface UseFilePickerOptions {
  /** The accept extensions */
  accept?: string | string[];
  /** The minimal size of each file */
  minSize?: number;
  /** The maximal size of each file */
  maxSize?: number;
  /** The success callback */
  onFilesSelected?: (files: File[]) => void;
  /** The error callback */
  onFilesRejected?: (errors: string[]) => void;
}

/* The use file picker return type */
export interface UseFilePickerReturn {
  /** The selected files list */
  files: File[];
  /** The possible errors */
  errors: string[];
  /** The file input change callback */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** The reset function */
  reset: () => void;
}

/**
 * @name useFilePicker
 * @description - Hook to handle and validate file input
 * @category Browser
 * TODO: Add params description
 */
export const useFilePicker = (options: UseFilePickerOptions): UseFilePickerReturn => {
  const { accept, minSize, maxSize, onFilesSelected, onFilesRejected } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.currentTarget.files;
    if (!selectedFiles) {
      return;
    }

    const newFiles: File[] = [];
    const newErrors: string[] = [];

    for (const file of selectedFiles) {
      if (accept && !Array.isArray(accept) && !file.name.endsWith(accept)) {
        newErrors.push(`File ${file.name} does not match the accepted type.`);
        continue;
      }

      if (Array.isArray(accept) && !accept.some((type) => file.name.endsWith(type))) {
        newErrors.push(`File ${file.name} does not match the accepted type.`);
        continue;
      }

      if (minSize && file.size < minSize) {
        newErrors.push(`File ${file.name} is too small.`);
        continue;
      }

      if (maxSize && file.size > maxSize) {
        newErrors.push(`File ${file.name} is too large.`);
        continue;
      }

      newFiles.push(file);
    }

    setFiles(newFiles);
    setErrors(newErrors);

    if (onFilesSelected) {
      onFilesSelected(newFiles);
    }

    if (onFilesRejected && newErrors.length > 0) {
      onFilesRejected(newErrors);
    }
  };

  const reset = () => {
    setFiles([]);
    setErrors([]);
  };

  return {
    files,
    errors,
    onChange,
    reset
  };
};
