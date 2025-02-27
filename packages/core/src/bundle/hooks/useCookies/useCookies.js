import { useEffect, useState } from 'react';
import { COOKIE_EVENT, dispatchCookieEvent, removeCookie, setCookie } from '../useCookie/useCookie';
export const getParsedCookies = () => Object.fromEntries(document.cookie.split('; ').map((cookie) => {
    const [key, ...value] = cookie.split('=');
    const decodedValue = decodeURIComponent(value.join('='));
    try {
        return [key, JSON.parse(decodedValue)];
    }
    catch {
        return [key, decodedValue];
    }
}));
export const clearCookies = () => {
    document.cookie.split('; ').forEach((cookie) => {
        const [name] = cookie.split('=');
        removeCookie(name);
    });
};
const setCookieItem = (key, value, options) => {
    setCookie(key, value, options);
    dispatchCookieEvent();
};
const removeCookieItem = (key, options) => {
    removeCookie(key, options);
    dispatchCookieEvent();
};
const clearCookieItems = () => {
    clearCookies();
    dispatchCookieEvent();
};
/**
 * @name useCookies
 * @description - Hook that manages cookie values
 * @category Browser
 *
 * @overload
 * @template {object} Value The type of the cookie values
 * @param {string} key The key of the cookie
 * @returns {UseCookieReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove, getAll, clear } = useCookies();
 */
export const useCookies = () => {
    const [value, setValue] = useState(typeof window !== 'undefined' ? getParsedCookies() : {});
    useEffect(() => {
        const onChange = () => setValue(getParsedCookies());
        window.addEventListener(COOKIE_EVENT, onChange);
        return () => {
            window.removeEventListener(COOKIE_EVENT, onChange);
        };
    }, []);
    const set = (key, value, options) => {
        if (value === null)
            return removeCookieItem(key);
        setCookieItem(key, value, options);
    };
    const remove = (key, options) => removeCookieItem(key, options);
    const getAll = () => getParsedCookies();
    const clear = () => clearCookieItems();
    return { value, set, remove, getAll, clear };
};
