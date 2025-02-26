import { useEffect, useState } from 'react';
import { clearCookies, getCookies, removeCookie, setCookie } from '../useCookie/helpers';
import { COOKIE_EVENT, dispatchCookieEvent } from '../useCookie/useCookie';
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
    const [value, setValue] = useState(typeof window !== 'undefined' ? getCookies(true) : {});
    useEffect(() => {
        const onChange = () => setValue(getCookies(true));
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
    const getAll = () => getCookies(true);
    const clear = () => clearCookieItems();
    return { value, set, remove, getAll, clear };
};
