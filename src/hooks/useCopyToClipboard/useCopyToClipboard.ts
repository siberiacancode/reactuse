import { useCallback, useState } from 'react';

export const legacyCopyToClipboard = (value: string) => {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = value;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
};

/** The use copy to clipboard return type */
interface UseCopyToClipboardReturn {
  /** The copied value */
  value: string | null;
  /** Function to copy to clipboard  */
  copy: (value: string) => Promise<void>;
}

/**
 * @name useCopyToClipboard
 * @description - Hook that manages a copy to clipboard
 * @category Browser
 *
 * @returns {UseCopyToClipboardReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const { value, copy } = useCopyToClipboard();
 */
export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [value, setValue] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (value: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setValue(value);
      } else {
        throw new Error('writeText not supported');
      }
    } catch (error) {
      legacyCopyToClipboard(value);
      setValue(value);
    }
  }, []);

  return { value, copy: copyToClipboard };
};
