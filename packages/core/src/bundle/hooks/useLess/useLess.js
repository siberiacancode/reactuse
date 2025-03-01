import { useEffect } from 'react';
/**
 * @name useLess
 * @description - Hook that humorously suggests using it less not for production
 * @category Humor
 *
 * @template Value The type of the value
 * @param {Value} [value] The value to be returned
 * @returns {Value} The value passed to the hook
 *
 * @example
 * const value = useLess(state);
 */
export const useLess = (value) => {
    useEffect(() => {
        console.warn("Warning: You forgot to delete the 'useLess' hook.");
    }, []);
    return value;
};
