import { useState } from 'react';
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
export const useObjectUrl = (object) => {
  const [value, setValue] = useState(() => {
    if (!object) return undefined;
    return URL.createObjectURL(object);
  });
  const revoke = () => {
    if (!value) return;
    URL.revokeObjectURL(value);
    setValue(undefined);
  };
  const set = (object) => {
    if (value) URL.revokeObjectURL(value);
    setValue(URL.createObjectURL(object));
  };
  return { value, revoke, set };
};
