import { useSyncExternalStore } from 'react';
const getSnapshot = () => window.navigator.languages;
const getServerSnapshot = () => [];
const subscribe = (callback) => {
    window.addEventListener('languagechange', callback);
    return () => {
        window.removeEventListener('languagechange', callback);
    };
};
/**
 * @name usePreferredLanguages
 * @description Hook that returns a browser preferred languages from navigator
 * @category Browser
 *
 * @returns {readonly string[]} An array of strings representing the user's preferred languages
 *
 * @example
 * const languages = usePreferredLanguages();
 */
export const usePreferredLanguages = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
