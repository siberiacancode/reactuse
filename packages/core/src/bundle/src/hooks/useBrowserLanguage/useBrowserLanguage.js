import { useSyncExternalStore } from 'react';
const getSnapshot = () => navigator.language;
const getServerSnapshot = () => 'undetermined';
const subscribe = (callback) => {
  window.addEventListener('languagechange', callback);
  return () => window.removeEventListener('languagechange', callback);
};
/**
 * @name useBrowserLanguage
 * @description - Hook that returns the current browser language
 * @category User
 * @usage medium

 * @browserapi navigator.language https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
 *
 * @returns {string} The current browser language
 *
 * @example
 * const browserLanguage = useBrowserLanguage();
 */
export const useBrowserLanguage = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
