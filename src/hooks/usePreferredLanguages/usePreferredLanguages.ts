import React from 'react';

import { isClient } from '@/utils/helpers';

/**
 * Hook returning the current browser preferred languages.
 *
 * @example
 * const languages = usePreferredLanguages()
 *
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
