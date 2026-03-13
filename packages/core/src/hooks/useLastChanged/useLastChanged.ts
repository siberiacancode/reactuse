import { useState } from 'react';

import { useDidUpdate } from '../useDidUpdate/useDidUpdate';

/** The use last changed options type  */
export interface UseLastChangedOptions {
  initialValue?: number;
}

/**
 * @name useLastChanged
 * @description - Hook for records the timestamp of the last change
 * @category Utilities
 * @usage low
 *
 * @param {any} source  The source of the last change
 * @param {number | null} [options.initialValue=null] The initial value
 * @returns {number | null} Return timestamp of the last change
 *
 * @example
 * const lastChanged = useLastChanged(source);
 */
export const useLastChanged = (source: any, options?: UseLastChangedOptions): number | null => {
  const [lastChanged, setLastChanged] = useState(options?.initialValue ?? null);

  useDidUpdate(() => setLastChanged(Date.now()), [source]);

  return lastChanged;
};
