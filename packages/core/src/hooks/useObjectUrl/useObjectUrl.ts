import { useState } from 'react';

/** The use object url return type */
export interface UseObjectUrlReturn {
  /** Current object URL */
  value?: string;
  /** Revokes the object URL */
  revoke: () => void;
  /** Creates the object URL */
  set: (object: Blob | MediaSource) => void;
}

/**
 * @name useObjectUrl
 * @description - Hook that creates and revokes an object URL for a Blob or MediaSource
 * @category Browser
 * @usage low
 *
 * @browserapi URL.createObjectURL https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
 *
 * @param {Blob | MediaSource} object The object to represent as a URL
 * @returns {UseObjectUrlReturn} An object with the current object URL
 *
 * @example
 * const { value } = useObjectUrl(blob);
 */
export const useObjectUrl = <Value extends Blob | MediaSource | undefined>(
  object?: Value
): UseObjectUrlReturn => {
  const [value, setValue] = useState(() => {
    if (!object) return undefined;
    return URL.createObjectURL(object);
  });

  const revoke = () => {
    if (!value) return;
    URL.revokeObjectURL(value);
    setValue(undefined);
  };

  const set = (object: Blob | MediaSource) => {
    if (value) URL.revokeObjectURL(value);
    setValue(URL.createObjectURL(object));
  };

  return { value, revoke, set };
};
