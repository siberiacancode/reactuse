import type { ChangeEvent } from 'react';
import { act, renderHook } from '@testing-library/react';

import { FilePickerValidationError, useFilePicker } from './useFilePicker';

it('Should initialize with default values', () => {
  const { result } = renderHook(() => useFilePicker({}));
  expect(result.current.files).toEqual([]);
  expect(result.current.errors).toEqual([]);
});

it('Should handle file selection with valid files', () => {
  const { result } = renderHook(() => useFilePicker({ accept: '.pdf' }));
  const file = new File(['file content'], 'example.pdf', { type: 'application/pdf' });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(result.current.files).toEqual([file]);
  expect(result.current.errors).toEqual([]);
});

it('Should handle file selection with invalid file extension', () => {
  const { result } = renderHook(() => useFilePicker({ accept: '.pdf' }));
  const file = new File(['file content'], 'example.docx', { type: 'application/msword' });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(result.current.files).toEqual([]);
  expect(result.current.errors).toEqual([
    { fileName: 'example.docx', errorType: FilePickerValidationError.WrongExtension }
  ]);
});

it('Should handle file selection with file size too small', () => {
  const { result } = renderHook(() => useFilePicker({ minSize: 1024 }));
  const file = new File(['file content'], 'example.pdf', { type: 'application/pdf' });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(result.current.files).toEqual([]);
  expect(result.current.errors).toEqual([
    { fileName: 'example.pdf', errorType: FilePickerValidationError.TooSmall }
  ]);
});

it('Should handle file selection with file size too large', () => {
  const { result } = renderHook(() => useFilePicker({ maxSize: 1024 }));
  const file = new File(['file content'.repeat(1025)], 'example.pdf', {
    type: 'application/pdf'
  });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(result.current.files).toEqual([]);
  expect(result.current.errors).toEqual([
    { fileName: 'example.pdf', errorType: FilePickerValidationError.TooLarge }
  ]);
});

it('Should call onFilesSelected callback when files are valid', () => {
  const onFilesSelected = vi.fn();
  const { result } = renderHook(() => useFilePicker({ onFilesSelected }));
  const file = new File(['file content'], 'example.pdf', { type: 'application/pdf' });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(onFilesSelected).toHaveBeenCalledTimes(1);
  expect(onFilesSelected).toHaveBeenCalledWith([file]);
});

it('Should call onFilesRejected callback when files are invalid', () => {
  const onFilesRejected = vi.fn();
  const { result } = renderHook(() => useFilePicker({ onFilesRejected, accept: '.pdf' }));
  const file = new File(['file content'], 'example.docx', { type: 'application/msword' });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(onFilesRejected).toHaveBeenCalledTimes(1);
  expect(onFilesRejected).toHaveBeenCalledWith([
    { fileName: 'example.docx', errorType: FilePickerValidationError.WrongExtension }
  ]);
});

it('Should reset files and errors when reset is called', () => {
  const { result } = renderHook(() => useFilePicker({}));
  const file = new File(['file content'], 'example.pdf', { type: 'application/pdf' });
  const event = { currentTarget: { files: [file] } } as unknown as ChangeEvent<HTMLInputElement>;

  act(() => {
    result.current.onChange(event);
  });

  expect(result.current.files).toEqual([file]);
  expect(result.current.errors).toEqual([]);

  act(() => {
    result.current.reset();
  });

  expect(result.current.files).toEqual([]);
  expect(result.current.errors).toEqual([]);
});
