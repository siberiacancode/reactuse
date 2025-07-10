import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

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
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(vi.useRealTimers);

it('Should use copy', () => {
  const { result } = renderHook(useCopy);

  expect(result.current.copied).toBeFalsy();
  expect(result.current.value).toBeUndefined();
  expect(result.current.copy).toBeTypeOf('function');
});

it('Should copy value to clipboard', async () => {
  const { result } = renderHook(useCopy);

  await act(() => result.current.copy('value'));

  expect(result.current.value).toBe('value');
  expect(result.current.copied).toBeTruthy();

  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledOnce();
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('value');
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

it('Should use custom delay', async () => {
  const { result } = renderHook(() => useCopy(2000));

  await act(() => result.current.copy('value'));

  expect(result.current.copied).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.copied).toBeTruthy();

  act(() => vi.advanceTimersByTime(1000));

  expect(result.current.copied).toBeFalsy();
});
