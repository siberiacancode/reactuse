import React from 'react';

/**
 * @name usePreferredLanguages
 * @description Hook that returns a browser preferred languages from navigator
 *
 * @returns {readonly string[]} An array of strings representing the user's preferred languages
 *
 * @example
 * const languages = usePreferredLanguages();
 */
export const usePreferredLanguages = () => {
  const subscribe = (callback: () => void) => {
    window.addEventListener('languagechange', callback);

    return () => {
      window.removeEventListener('languagechange', callback);
    };
  };

  const getSnapshot = () => window.navigator.languages;

  const getServerSnapshot = () => ['en'] as const;

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
