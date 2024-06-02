import React from 'react';

import { isClient } from '@/utils/helpers';

/**
 * @name usePreferredLanguages
 * @description Hook that returns a browser preferred languages from navigator.
 *
 * @returns {string[]} Readonly array of strings representing the user's preferred languages
 *
 * @example
 * const languages = usePreferredLanguages()
 */
export const usePreferredLanguages = () => {
  const preferredLanguages = React.useRef<readonly string[]>([]);

  if (!isClient) {
    preferredLanguages.current = ['ru-RU', 'en-US'];
  } else {
    preferredLanguages.current = navigator.languages;
  }

  return preferredLanguages.current;
};
