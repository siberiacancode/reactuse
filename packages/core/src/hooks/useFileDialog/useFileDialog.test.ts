import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { renderHookServer } from '@/tests';

import { useFileDialog } from './useFileDialog';

const createFileList = (files: File[]): FileList =>
  Object.assign(files, {
    item: (index: number) => files[index] ?? null,
    length: files.length
  }) as unknown as FileList;

afterEach(() => {
  vi.restoreAllMocks();
});

it('Should use file dialog', () => {
  const { result } = renderHook(useFileDialog);

  expect(result.current.value).toBeNull();
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
});

it('Should open file dialog', () => {
  const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');
  const { result } = renderHook(useFileDialog);

  act(() => result.current.open());

  expect(clickSpy).toHaveBeenCalledOnce();
});

it('Should use file dialog on server side', () => {
  const { result } = renderHookServer(useFileDialog);

  expect(result.current.value).toBeNull();
  expect(result.current.open).toBeTypeOf('function');
  expect(result.current.reset).toBeTypeOf('function');
});

it('Should open file dialog with callback', () => {
  const callback = vi.fn();
  const createElementSpy = vi.spyOn(document, 'createElement');
  const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click');

  const { result } = renderHook(() => useFileDialog(callback));

  act(result.current.open);

  expect(createElementSpy).toHaveBeenCalledWith('input');
  expect(clickSpy).toHaveBeenCalledOnce();
  expect(callback).not.toHaveBeenCalled();
});

it('Should open with params and override base options', () => {
  const createElementSpy = vi.spyOn(document, 'createElement');

  const { result } = renderHook(() =>
    useFileDialog({
      accept: 'image/*',
      multiple: false
    })
  );

  const input = createElementSpy.mock.results.find(
    (call) => call.value instanceof HTMLInputElement
  )!.value as HTMLInputElement;

  act(() => {
    result.current.open({
      accept: '.txt',
      multiple: true
    });
  });

  expect(input.accept).toBe('.txt');
  expect(input.multiple).toBeTruthy();
});

it('Should update value after input change', () => {
  const callback = vi.fn();
  const createElementSpy = vi.spyOn(document, 'createElement');

  const { result } = renderHook(() => useFileDialog(callback));

  const input = createElementSpy.mock.results.find(
    (call) => call.value instanceof HTMLInputElement
  )!.value as HTMLInputElement;

  const file = new File(['content'], 'test.txt', { type: 'text/plain' });
  const files = createFileList([file]);

  Object.defineProperty(input, 'files', {
    value: files,
    configurable: true
  });

  act(() => input.dispatchEvent(new Event('change')));

  expect(result.current.value).toBe(files);
  expect(callback).toHaveBeenCalledOnce();
  expect(callback).toHaveBeenCalledWith(files);
});

it('Should reset files before opening', () => {
  const callback = vi.fn();
  const createElementSpy = vi.spyOn(document, 'createElement');

  const { result } = renderHook(() => useFileDialog(callback));

  const input = createElementSpy.mock.results.find(
    (call) => call.value instanceof HTMLInputElement
  )!.value as HTMLInputElement;
  const clickSpy = vi.spyOn(input, 'click');
  const file = new File(['content'], 'test.txt', { type: 'text/plain' });
  const files = createFileList([file]);

  Object.defineProperty(input, 'files', {
    value: files,
    configurable: true
  });

  act(() => input.dispatchEvent(new Event('change')));

  expect(result.current.value).toBe(files);

  act(() => result.current.open({ reset: true }));

  expect(result.current.value).toBeNull();
  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith(null);
  expect(clickSpy).toHaveBeenCalledOnce();
});

it('Should reset files', () => {
  const callback = vi.fn();
  const createElementSpy = vi.spyOn(document, 'createElement');

  const { result } = renderHook(() => useFileDialog(callback));

  const input = createElementSpy.mock.results.find(
    (call) => call.value instanceof HTMLInputElement
  )!.value as HTMLInputElement;
  const file = new File(['content'], 'test.txt', { type: 'text/plain' });
  const files = createFileList([file]);

  Object.defineProperty(input, 'files', {
    value: files,
    configurable: true
  });

  act(() => input.dispatchEvent(new Event('change')));

  expect(result.current.value).toBe(files);

  act(result.current.reset);

  expect(result.current.value).toBeNull();
  expect(callback).toHaveBeenCalledWith(null);
});

it('Should cleanup on unmount', () => {
  const createElementSpy = vi.spyOn(document, 'createElement');

  const { unmount } = renderHook(() => useFileDialog());

  const input = createElementSpy.mock.results.find(
    (call) => call.value instanceof HTMLInputElement
  )!.value as HTMLInputElement;
  const removeSpy = vi.spyOn(input, 'remove');

  unmount();

  expect(removeSpy).toHaveBeenCalledOnce();
});
