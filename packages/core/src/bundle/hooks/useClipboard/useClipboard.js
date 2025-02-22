import { useCallback, useEffect, useState } from 'react';

import { usePermission } from '../usePermission/usePermission';
export const isPermissionAllowed = (status) => status === 'granted' || status === 'prompt';
export const legacyCopyToClipboard = (value) => {
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = value;
  tempTextArea.readOnly = true;
  tempTextArea.style.fontSize = '16px';
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand('copy');
  document.body.removeChild(tempTextArea);
};
/**
 * @name useClipboard
 * @description - Hook that manages a copy to clipboard
 * @category Browser
 *
 * @param {boolean} [params.enabled] Whether the copy to clipboard is enabled
 * @returns {UseCopyToClipboardReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const { supported, value, copy } = useClipboard();
 */
export const useClipboard = (params) => {
  const supported = typeof navigator !== 'undefined' && 'clipboard' in navigator;
  const [value, setValue] = useState(null);
  const clipboardReadPermission = usePermission('clipboard-read');
  const clipboardWritePermissionWrite = usePermission('clipboard-write');
  const enabled = params?.enabled ?? false;
  const set = async () => {
    try {
      if (supported && isPermissionAllowed(clipboardReadPermission.state)) {
        const value = await navigator.clipboard.readText();
        setValue(value);
      } else setValue(document?.getSelection?.()?.toString() ?? '');
    } catch {
      setValue(document?.getSelection?.()?.toString() ?? '');
    }
  };
  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('copy', set);
    document.addEventListener('cut', set);
    return () => {
      document.removeEventListener('copy', set);
      document.removeEventListener('cut', set);
    };
  }, [enabled]);
  const copy = useCallback(async (value) => {
    try {
      if (supported || isPermissionAllowed(clipboardWritePermissionWrite.state)) {
        await navigator.clipboard.writeText(value);
      } else {
        legacyCopyToClipboard(value);
      }
    } catch {
      legacyCopyToClipboard(value);
    }
    setValue(value);
  }, []);
  return { supported, value, copy };
};
