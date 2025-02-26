import { useEffect, useSyncExternalStore } from 'react';
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
const cookieSubscribe = (callback) => {
    window.addEventListener(COOKIE_EVENT, callback);
    return () => window.removeEventListener(COOKIE_EVENT, callback);
};
const getServerSnapshot = () => undefined;
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
    if (typeof window === 'undefined')
        return {
            value: initialValue instanceof Function ? initialValue() : initialValue
        };
    const getSnapshot = () => getCookieItem(key);
    const cookie = useSyncExternalStore(cookieSubscribe, getSnapshot, getServerSnapshot);
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
    const serializer = (value) => {
        if (options?.serializer)
            return options.serializer(value);
        return JSON.stringify(value);
    };
    const set = (value, options) => setCookieItem(key, serializer(value), options);
    const remove = (options) => removeCookieItem(key, options);
    useEffect(() => {
        const value = getCookieItem(key);
        if (value === undefined && initialValue !== undefined) {
            setCookieItem(key, serializer(initialValue instanceof Function ? initialValue() : initialValue));
        }
    }, [key]);
    return { value: cookie ? deserializer(cookie) : undefined, set, remove };
};
