import { useEffect, useState } from 'react';

/** The use last changed options type  */
export interface UseLastChangedOptions {
  initialValue?: number;
}

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
export const useLastChanged = (source: any, options?: UseLastChangedOptions): number | null => {
  const [lastChanged, setLastChanged] = useState(options?.initialValue ?? null);

  useEffect(() => {
    setLastChanged(Date.now());
  }, [source]);

  return lastChanged;
};
