import { useEffect, useState } from 'react';
export const getCookies = () => Object.fromEntries(document.cookie.split('; ').map((cookie) => {
    const [key, ...value] = cookie.split('=');
    const decodedValue = decodeURIComponent(value.join('='));
    return [key, decodedValue];
}));
export const removeCookie = (key, options = {}) => {
    document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${options.path ? `; path=${options.path}` : ''}${options.domain ? `; domain=${options.domain}` : ''}${options.maxAge ? `; max-age=0` : ''}${options.expires ? `; expires=Thu, 01 Jan 1970 00:00:00 GMT` : ''}${options.secure ? `; secure` : ''}${options.sameSite ? `; samesite=${options.sameSite}` : ''}`;
};
export const setCookie = (key, value, options = {}) => {
    const cookie = [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`];
    if (options.path)
        cookie.push(`path=${options.path}`);
    if (options.domain)
        cookie.push(`domain=${options.domain}`);
    if (typeof options.maxAge === 'number')
        cookie.push(`max-age=${options.maxAge}`);
    if (options.expires)
        cookie.push(`expires=${options.expires.toUTCString()}`);
    if (options.secure)
        cookie.push(`secure`);
    if (options.httpOnly)
        cookie.push(`httpOnly`);
    if (options.sameSite)
        cookie.push(`samesite=${options.sameSite}`);
    document.cookie = cookie.join('; ');
};
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
    if (typeof document === 'undefined')
        return {
            value: initialValue instanceof Function ? initialValue() : initialValue
        };
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
            setCookieItem(key, serializer(value), options);
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
    const set = (value, params) => setCookieItem(key, serializer(value), { ...options, ...params });
    const remove = (params) => removeCookieItem(key, { ...options, ...params });
    return { value, set, remove };
};
