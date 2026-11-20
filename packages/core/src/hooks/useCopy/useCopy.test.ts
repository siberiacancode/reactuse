import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

import { useCopy } from './useCopy';

const mockNavigatorClipboardWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    ...globalThis.navigator.clipboard,
    writeText: mockNavigatorClipboardWriteText
  }
});

const mockDocumentExecCommand = vi.fn();
Object.assign(document, {
  execCommand: mockDocumentExecCommand
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(vi.useRealTimers);

it('Should use copy', () => {
  const { result } = renderHook(useCopy);

  expect(result.current.copied).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.copy).toBeTypeOf('function');
});

it('Should use copy on server side', () => {
  const { result } = renderHookServer(useCopy);

  expect(result.current.copied).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.copy).toBeTypeOf('function');
});

it('Should copy value to clipboard', async () => {
  const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
  const { result } = renderHook(useCopy);

  await act(() => result.current.copy('value'));

  expect(result.current.value).toBe('value');
  expect(result.current.copied).toBeTruthy();

  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledOnce();
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('value');
  expect(clearTimeoutSpy).not.toHaveBeenCalled();
});

it('Should copy value to clipboard if writeText not supported', async () => {
  mockNavigatorClipboardWriteText.mockRejectedValueOnce(new Error('writeText not supported'));
  const { result } = renderHook(useCopy);

  await act(() => result.current.copy('value'));

  expect(result.current.value).toBe('value');
  expect(result.current.copied).toBeTruthy();

  expect(mockDocumentExecCommand).toHaveBeenCalledOnce();
  expect(mockDocumentExecCommand).toHaveBeenLastCalledWith('copy');
});

it('Should reset copied status after delay', async () => {
  const { result } = renderHook(useCopy);

  await act(() => result.current.copy('value'));

  expect(result.current.copied).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.copied).toBeFalsy();
  expect(result.current.value).toBe('value');
});

it('Should restart reset delay after copying again', async () => {
  const { result } = renderHook(useCopy);

  await act(() => result.current.copy('first-value'));
  act(() => vi.advanceTimersByTime(500));
  await act(() => result.current.copy('second-value'));
  act(() => vi.advanceTimersByTime(500));

  expect(result.current.copied).toBeTruthy();
  expect(result.current.value).toBe('second-value');

  act(() => vi.advanceTimersByTime(500));

  expect(result.current.copied).toBeFalsy();
});

it('Should use custom delay', async () => {
  const { result } = renderHook(() => useCopy(2000));

  await act(() => result.current.copy('value'));

  expect(result.current.copied).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.copied).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.copied).toBeFalsy();
});
