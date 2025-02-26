export const getCookies = (shouldParse = false) => Object.fromEntries(document.cookie.split('; ').map((cookie) => {
    const [key, ...value] = cookie.split('=');
    const decodedValue = decodeURIComponent(value.join('='));
    const parse = (value) => {
        if (!shouldParse)
            return value;
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    };
    return [key, parse(decodedValue)];
}));
