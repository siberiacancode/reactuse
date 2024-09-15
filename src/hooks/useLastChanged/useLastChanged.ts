import { useEffect, useState } from 'react';

import { getDate } from '@/utils/helpers';

/** The use last changed source type */
export type UseLastChangedSource<T> = T;

/** The use last changed options type  */
export interface UseLastChangedOptions {
  initialValue?: number;
}

/**
 * @name useLastChanged
 * @description - Hook for records the timestamp of the last change
 * @category Time
 *
 * @param {UseLastChangedSource} source  The source of the last change
 * @param {number | null} [options.initialValue=null] The initial value
 * @returns {number | null} Return timestamp of the last change
 *
 * @example
 * const lastChanged = useLastChanged(source, { initialValue: 0 });
 */
export const useLastChanged = <T>(
  source: UseLastChangedSource<T>,
  options?: UseLastChangedOptions
): number | null => {
  const [lastChanged, setLastChanged] = useState(options?.initialValue ?? null);

  useEffect(() => {
    if (source) {
      setLastChanged(getDate().timestamp);
    }
  }, [source]);

  return lastChanged;
};
