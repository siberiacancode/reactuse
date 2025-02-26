export const getCookies = () => Object.fromEntries(document.cookie.split('; ').map((cookie) => {
    const [key, ...value] = cookie.split('=');
    const decodedValue = decodeURIComponent(value.join('='));
    return [key, decodedValue];
}));
