import { copy, legacyCopyToClipboard } from './copy';

const writeText = vi.fn();
const execCommand = vi.fn();

beforeEach(() => {
  Object.assign(navigator, { clipboard: { writeText } });
  Object.assign(document, { execCommand });
});

it('Should copy text with the Clipboard API', async () => {
  await copy('value');

  expect(writeText).toHaveBeenCalledOnce();
  expect(writeText).toHaveBeenCalledWith('value');
  expect(execCommand).not.toHaveBeenCalled();
});

it('Should copy text with a temporary textarea', () => {
  legacyCopyToClipboard('legacy value');

  const textarea = document.querySelector('textarea');

  expect(execCommand).toHaveBeenCalledOnce();
  expect(execCommand).toHaveBeenCalledWith('copy');
  expect(textarea).toBeNull();
});

it('Should fall back to a temporary textarea when the Clipboard API rejects', async () => {
  writeText.mockRejectedValueOnce(new Error('Clipboard API is unavailable'));

  await copy('fallback value');

  expect(writeText).toHaveBeenCalledWith('fallback value');
  expect(execCommand).toHaveBeenCalledOnce();
  expect(execCommand).toHaveBeenCalledWith('copy');
  expect(document.querySelector('textarea')).toBeNull();
});

it('Should retry the legacy fallback when its first attempt throws', async () => {
  writeText.mockRejectedValueOnce(new Error('Clipboard API is unavailable'));
  execCommand.mockImplementationOnce(() => {
    throw new Error('Copy command failed');
  });

  await copy('fallback value');

  expect(execCommand).toHaveBeenCalledTimes(2);
  expect(execCommand).toHaveBeenLastCalledWith('copy');
});
