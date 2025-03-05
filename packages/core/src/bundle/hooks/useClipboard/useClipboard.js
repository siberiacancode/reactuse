import { useEffect, useState } from 'react';
import { copy } from '@/utils/helpers';
/**
 * @name useClipboard
 * @description - Hook that manages a copy to clipboard
 * @category Browser
 *
 * @browserapi navigator.clipboard https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
 *
 * @param {boolean} [params.enabled=false] Whether the copy to clipboard is enabled
 * @returns {UseCopyToClipboardReturn} An object containing the boolean state value and utility functions to manipulate the state
 *
 * @example
 * const { supported, value, copy } = useClipboard();
 */
export const useClipboard = (params) => {
    const [value, setValue] = useState(null);
    const enabled = params?.enabled ?? false;
    const set = async () => {
        try {
            const value = await navigator.clipboard.readText();
            setValue(value);
        }
        catch {
            setValue(document.getSelection?.()?.toString() ?? '');
        }
    };
    useEffect(() => {
        if (!enabled)
            return;
        document.addEventListener('copy', set);
        document.addEventListener('cut', set);
        return () => {
            document.removeEventListener('copy', set);
            document.removeEventListener('cut', set);
        };
    }, [enabled]);
    const copyToClipboard = async (value) => {
        copy(value);
        setValue(value);
    };
    return { value, copy: copyToClipboard };
};
