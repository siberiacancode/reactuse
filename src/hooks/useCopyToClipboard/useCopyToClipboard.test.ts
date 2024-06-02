import { act, renderHook } from '@testing-library/react';

import { useCopyToClipboard } from './useCopyToClipboard';

const mockNavigatorClipboardWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    ...global.navigator.clipboard,
    writeText: mockNavigatorClipboardWriteText
  }
});

const mockDocumentExecCommand = vi.fn();
Object.assign(document, {
  execCommand: mockDocumentExecCommand
});

it('Should use copy to clipboard', () => {
  const { result } = renderHook(useCopyToClipboard);

  expect(result.current.value).toBeNull();
  expect(typeof result.current.copy).toBe('function');
});

it('Should copy value to clipboard', async () => {
  const { result } = renderHook(useCopyToClipboard);

  await act(() => result.current.copy('string'));

  expect(result.current.value).toBe('string');
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledOnce();
  expect(mockNavigatorClipboardWriteText).toHaveBeenCalledWith('string');
});

it('Should copy value to clipboard if writeText not supported', async () => {
  mockNavigatorClipboardWriteText.mockRejectedValueOnce(new Error('writeText not supported'));
  const { result } = renderHook(useCopyToClipboard);

  await act(() => result.current.copy('string'));

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { execCommand } = document;

  expect(result.current.value).toBe('string');
  expect(execCommand).toHaveBeenCalledOnce();
  expect(execCommand).toHaveBeenLastCalledWith('copy');
});
