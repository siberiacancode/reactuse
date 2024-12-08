import type { ChangeEvent } from 'react';
import { useState } from 'react';

/* The use file picker error variants */
export enum FilePickerValidationError {
  WrongExtension = 'wrong-extension',
  TooLarge = 'too-large',
  TooSmall = 'too-small'
}

/* The use file picker error type */
export interface UseFilePickerError {
  /** The file name */
  fileName: string;
  /** The error variant */
  errorType: FilePickerValidationError;
}

/* The use file picker options */
export interface UseFilePickerOptions {
  /** The default files set */
  defaultFiles?: File[];
  /** The accept extensions */
  accept?: string | string[];
  /** The minimal size of each file in bytes */
  minSize?: number;
  /** The maximal size of each file in bytes */
  maxSize?: number;
  /** The success callback */
  onFilesSelected?: (files: File[]) => void;
  /** The error callback */
  onFilesRejected?: (errors: UseFilePickerError[]) => void;
}

/* The use file picker return type */
export interface UseFilePickerReturn {
  /** The selected files list */
  files: File[];
  /** The possible errors */
  errors: UseFilePickerError[];
  /** The file input change callback */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** The reset function */
  reset: () => void;
}

/**
 * @name useFilePicker
 * @description - Hook to handle and validate file input
 * @category Browser
 *
 * @param {File[]} [options.defaultFiles] The default files set
 * @param {string | string[]} [options.accept] The accepted file extensions
 * @param {number} [options.minSize] The minimal bytes size of accepted file
 * @param {number} [options.maxSize] The maximal bytes size of accepted file
 * @param {number} [options.onFilesSelected] The callback called if there are no validation errors after attaching files
 * @param {number} [options.onFilesRejected] The callback called if there are errors after attaching files
 * @returns {UseFilePickerReturn} An object containing the selected files
 *
 * @example
 * const { value errors, reset, onChange } = useFileDialog({ minSize: 1024, accept: ['.docx', '.doc'] });
 */
export const useFilePicker = (options: UseFilePickerOptions): UseFilePickerReturn => {
  const { defaultFiles = [], accept, minSize, maxSize, onFilesSelected, onFilesRejected } = options;

  const [files, setFiles] = useState<File[]>(defaultFiles);
  const [errors, setErrors] = useState<UseFilePickerError[]>([]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.currentTarget.files;
    if (!selectedFiles) {
      return;
    }

    const newFiles: File[] = [];
    const newErrors: UseFilePickerError[] = [];

    for (const file of selectedFiles) {
      const notMatchesExtension =
        (accept && !Array.isArray(accept) && !file.name.endsWith(accept)) ||
        (Array.isArray(accept) && !accept.some((type) => file.name.endsWith(type)));

      if (notMatchesExtension) {
        newErrors.push({
          fileName: file.name,
          errorType: FilePickerValidationError.WrongExtension
        });
        continue;
      }

      if (minSize && file.size < minSize) {
        newErrors.push({
          fileName: file.name,
          errorType: FilePickerValidationError.TooSmall
        });
        continue;
      }

      if (maxSize && file.size > maxSize) {
        newErrors.push({
          fileName: file.name,
          errorType: FilePickerValidationError.TooLarge
        });
        continue;
      }

      newFiles.push(file);
    }

    setFiles(newFiles);
    setErrors(newErrors);

    if (!newErrors.length && onFilesSelected) {
      onFilesSelected(newFiles);
    } else if (onFilesRejected) {
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
