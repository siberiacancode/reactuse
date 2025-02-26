import { useEffect, useState } from 'react';
import { getCookies, removeCookie, setCookie } from './helpers';
export const COOKIE_EVENT = 'reactuse-cookie';
export const dispatchCookieEvent = () => window.dispatchEvent(new Event(COOKIE_EVENT));
const setCookieItem = (key, value, options) => {
    setCookie(key, value, options);
    dispatchCookieEvent();
};
const removeCookieItem = (key, options) => {
    removeCookie(key, options);
    dispatchCookieEvent();
};
const getCookieItem = (key) => {
    const cookies = getCookies();
    return cookies[key];
};
/**
 * @name useCookie
 * @description - Hook that manages cookie value
 * @category Browser
 *
 * @overload
 * @template Value The type of the cookie value
 * @param {string} key The key of the cookie
 * @param {UseCookieInitialValue<Value>} [initialValue] The initial value of the cookie
 * @returns {UseCookieReturn<Value>} The value and the set function
 *
 * @example
 * const { value, set, remove } = useCookie('key', 'value');
 */
export const useCookie = (key, params) => {
    const options = (typeof params === 'object' &&
        params &&
        ('serializer' in params || 'deserializer' in params || 'initialValue' in params)
        ? params
        : undefined);
    const initialValue = (options ? options?.initialValue : params);
    const serializer = (value) => {
        if (options?.serializer)
            return options.serializer(value);
        return JSON.stringify(value);
    };
    const deserializer = (value) => {
        if (options?.deserializer)
            return options.deserializer(value);
        if (value === 'undefined')
            return undefined;
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    };
    const [value, setValue] = useState(() => {
        const cookieValue = getCookieItem(key);
        if (cookieValue === undefined && initialValue !== undefined) {
            const value = initialValue instanceof Function ? initialValue() : initialValue;
            setCookieItem(key, serializer(value));
            return value;
        }
        return cookieValue ? deserializer(cookieValue) : undefined;
    });
    useEffect(() => {
        const onChange = () => {
            const cookieValue = getCookieItem(key);
            setValue(cookieValue ? deserializer(cookieValue) : undefined);
        };
        window.addEventListener(COOKIE_EVENT, onChange);
        return () => window.removeEventListener(COOKIE_EVENT, onChange);
    }, [key]);
    const set = (value, options) => setCookieItem(key, serializer(value), options);
    const remove = (options) => removeCookieItem(key, options);
    return { value, set, remove };
};
