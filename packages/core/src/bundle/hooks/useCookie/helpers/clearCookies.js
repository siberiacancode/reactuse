import { removeCookie } from './removeCookie';
export const clearCookies = () => {
    document.cookie.split('; ').forEach((cookie) => {
        const [name] = cookie.split('=');
        removeCookie(name);
    });
};
