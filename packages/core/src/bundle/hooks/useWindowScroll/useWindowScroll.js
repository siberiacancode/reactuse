import { useEffect, useState } from 'react';
export const scrollTo = ({ x, y, behavior = 'smooth' }) => {
    const scrollOptions = { behavior };
    if (typeof x === 'number')
        scrollOptions.left = x;
    if (typeof y === 'number')
        scrollOptions.top = y;
    window.scrollTo(scrollOptions);
};
/**
 * @name useWindowScroll
 * @description - Hook that manages the window scroll position
 * @category Browser
 *
 * @returns {UseWindowScrollReturn} An object containing the current window scroll position
 *
 * @example
 * const { value, scrollTo } = useWindowScroll();
 */
export const useWindowScroll = () => {
    const [value, setValue] = useState({
        x: typeof window !== 'undefined' ? window.scrollX : Number.POSITIVE_INFINITY,
        y: typeof window !== 'undefined' ? window.scrollY : Number.POSITIVE_INFINITY
    });
    useEffect(() => {
        const onChange = () => setValue({ x: window.scrollX, y: window.scrollY });
        window.addEventListener('scroll', onChange);
        window.addEventListener('resize', onChange);
        return () => {
            window.removeEventListener('scroll', onChange);
            window.removeEventListener('resize', onChange);
        };
    }, []);
    return { value, scrollTo };
};
