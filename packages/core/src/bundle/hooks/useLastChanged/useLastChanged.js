import { useState } from 'react';
import { useDidUpdate } from '../useDidUpdate/useDidUpdate';
/**
 * @name useLastChanged
 * @description - Hook for records the timestamp of the last change
 * @category Time
 *
 * @param {any} source  The source of the last change
 * @param {number | null} [options.initialValue=null] The initial value
 * @returns {number | null} Return timestamp of the last change
 *
 * @example
 * const lastChanged = useLastChanged(source);
 */
export const useLastChanged = (source, options) => {
    const [lastChanged, setLastChanged] = useState(options?.initialValue ?? null);
    useDidUpdate(() => setLastChanged(Date.now()), [source]);
    return lastChanged;
};
