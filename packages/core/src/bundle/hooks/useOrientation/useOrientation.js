import { useEffect, useState } from 'react';
/**
 * @name useOrientation
 * @description - Hook that returns the current screen orientation
 * @category Browser
 *
 * @returns {UseOrientationReturn} An object containing the current screen orientation
 *
 * @example
 * const { angle, type } = useOrientation();
 */
export const useOrientation = () => {
    const [orientation, setOrientation] = useState({ angle: 0, type: 'landscape-primary' });
    useEffect(() => {
        const onChange = () => {
            const { angle, type } = window.screen.orientation;
            setOrientation({
                angle,
                type
            });
        };
        window.screen.orientation.addEventListener('change', onChange);
        return () => window.screen.orientation.removeEventListener('change', onChange);
    }, []);
    return orientation;
};
