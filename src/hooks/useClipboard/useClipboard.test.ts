import { act, renderHook } from '@testing-library/react';

import { useClipboard } from './useClipboard';

const mockNavigatorClipboardWriteText = vi.fn();
const mockNavigatorClipboardReadText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    ...globalThis.navigator.clipboard,
    writeText: mockNavigatorClipboardWriteText,
    readText: mockNavigatorClipboardReadText
  }
});

const mockDocumentExecCommand = vi.fn();
const mockDocumentGetSelection = vi.fn();
Object.assign(document, {
  execCommand: mockDocumentExecCommand,
  getSelection: mockDocumentGetSelection
});

it('Should use copy to clipboard', () => {
  const { result } = renderHook(useClipboard);

  expect(result.current.value).toBeNull();
  expect(result.current.supported).toBeTruthy();
  expect(typeof result.current.copy).toBe('function');
});

it('Should copy value to clipboard', async () => {
  const { result } = renderHook(useClipboard);

  await act(() => result.current.copy('string'));

  expect(result.current.value).toBe('string');
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledOnce();
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('string');
});

it('Should copy value to clipboard if writeText not supported', async () => {
  mockNavigatorClipboardWriteText.mockRejectedValueOnce(new Error('writeText not supported'));
  const { result } = renderHook(useClipboard);

  await act(() => result.current.copy('string'));

  const { execCommand } = document;

  expect(result.current.value).toBe('string');
  expect(execCommand).toHaveBeenCalledOnce();
  expect(execCommand).toHaveBeenLastCalledWith('copy');
});

it('Should read value from clipboard if readText not supported', async () => {
  mockNavigatorClipboardReadText.mockRejectedValueOnce(new Error('readText not supported'));
  const { result } = renderHook(() => useClipboard({ enabled: true }));

  mockDocumentGetSelection.mockReturnValue({ toString: () => 'copied' });
  await act(() => document.dispatchEvent(new Event('copy')));

  const { getSelection } = document;

  expect(result.current.value).toBe('copied');
  expect(getSelection).toHaveBeenCalledOnce();
});

it('Should change value upon copy and cut events', async () => {
  const { result } = renderHook(() => useClipboard({ enabled: true }));

  mockNavigatorClipboardReadText.mockResolvedValue('copied');
  await act(() => document.dispatchEvent(new Event('copy')));

  expect(result.current.value).toBe('copied');
  expect(mockNavigatorClipboardReadText).toHaveBeenCalled();
});

it('Should change value upon cut event', async () => {
  const { result } = renderHook(() => useClipboard({ enabled: true }));

  mockNavigatorClipboardReadText.mockResolvedValue('cut');
  await act(() => document.dispatchEvent(new Event('cut')));

  expect(result.current.value).toBe('cut');
  expect(mockNavigatorClipboardReadText).toHaveBeenCalled();
});
