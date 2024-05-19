import { useCallback, useState } from 'react';

type ClipboardCallback = (value: string) => void;

type UseClipboardReturn = readonly [value: string, copy: ClipboardCallback];

/**
 * Hook provides a clipboard state and function that sets a value to the clipboard
 *
 * @returns {UseClipboardReturn} A tuple of state and update function
 */
export const useClipboard = (): UseClipboardReturn => {
  const [value, setValue] = useState('');

  const updateValue = useCallback(() => {
    window.navigator.clipboard
      .readText()
      .then((text) => setValue(text))
      .catch((reason) => console.error('[useClipboard]', reason));
  }, []);

  const copy = useCallback<ClipboardCallback>((value: string) => {
    setValue(value);

    window.navigator.clipboard.writeText(value);
  }, []);

  document.addEventListener('copy', updateValue);
  document.addEventListener('cut', updateValue);

  return [value, copy] as const;
};
