import { act, renderHook } from '@testing-library/react';

import { renderHookServer } from '@/tests';

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

beforeEach(() => {
  Object.assign(document, {
    execCommand: mockDocumentExecCommand,
    getSelection: mockDocumentGetSelection
  });
});

it('Should use copy to clipboard', () => {
  const { result } = renderHook(useClipboard);

  expect(result.current.value).toBeNull();
  expect(result.current.copy).toBeTypeOf('function');
});

it('Should use copy to clipboard on server side', () => {
  const { result } = renderHookServer(useClipboard);

  expect(result.current.value).toBeNull();
  expect(result.current.copy).toBeTypeOf('function');
});

it('Should ignore clipboard events when disabled by default', () => {
  const { result } = renderHook(useClipboard);

  act(() => {
    document.dispatchEvent(new Event('copy'));
    document.dispatchEvent(new Event('cut'));
  });

  expect(result.current.value).toBeNull();
  expect(mockNavigatorClipboardReadText).not.toHaveBeenCalled();
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

  await act(() => result.current.copy('value'));

  const { execCommand } = document;

  expect(result.current.value).toBe('value');
  expect(execCommand).toHaveBeenCalledOnce();
  expect(execCommand).toHaveBeenLastCalledWith('copy');
});

it('Should fall back to selected text when clipboard reading fails', async () => {
  mockNavigatorClipboardReadText.mockRejectedValueOnce(new Error('readText not supported'));
  const { result } = renderHook(() => useClipboard({ enabled: true }));

  mockDocumentGetSelection.mockReturnValue({ toString: () => 'copied' });
  await act(() => document.dispatchEvent(new Event('copy')));

  const { getSelection } = document;

  expect(result.current.value).toBe('copied');
  expect(getSelection).toHaveBeenCalledOnce();
});

it('Should fall back to empty string when selection is empty', async () => {
  mockNavigatorClipboardReadText.mockRejectedValueOnce(new Error('readText not supported'));
  mockDocumentGetSelection.mockReturnValue(null);
  const { result } = renderHook(() => useClipboard({ enabled: true }));

  await act(() => document.dispatchEvent(new Event('copy')));

  expect(result.current.value).toBe('');
  expect(mockDocumentGetSelection).toHaveBeenCalledOnce();
});

it('Should fall back to empty string when selection API is unavailable', async () => {
  mockNavigatorClipboardReadText.mockRejectedValueOnce(new Error('readText not supported'));
  Object.assign(document, { getSelection: undefined });
  const { result } = renderHook(() => useClipboard({ enabled: true }));

  try {
    await act(() => document.dispatchEvent(new Event('copy')));

    expect(result.current.value).toBe('');
  } finally {
    Object.assign(document, { getSelection: mockDocumentGetSelection });
  }
});

it('Should change value upon copy event', async () => {
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

it('Should handle enabled changes', async () => {
  mockNavigatorClipboardReadText
    .mockResolvedValueOnce('enabled')
    .mockResolvedValueOnce('re-enabled');
  const { result, rerender } = renderHook((enabled) => useClipboard({ enabled }), {
    initialProps: true
  });

  await act(() => document.dispatchEvent(new Event('copy')));

  expect(result.current.value).toBe('enabled');

  rerender(false);
  act(() => document.dispatchEvent(new Event('copy')));

  expect(result.current.value).toBe('enabled');

  rerender(true);
  await act(() => document.dispatchEvent(new Event('cut')));

  expect(result.current.value).toBe('re-enabled');
  expect(mockNavigatorClipboardReadText).toHaveBeenCalledTimes(2);
});

it('Should cleanup on unmount', () => {
  const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  const { unmount } = renderHook(() => useClipboard({ enabled: true }));

  unmount();

  expect(removeEventListenerSpy).toHaveBeenCalledWith('copy', expect.any(Function));
  expect(removeEventListenerSpy).toHaveBeenCalledWith('cut', expect.any(Function));
});
