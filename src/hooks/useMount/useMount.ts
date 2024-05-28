import React from 'react';

/**
 * @name useMount
 * @description - Hook that executes a callback when the component mounts
 *
 * @param {React.EffectCallback} effect The callback to execute
 *
 * @example
 * useMount(() => console.log('This effect runs on the initial render'));
 */
export const useMount = (effect: React.EffectCallback) => React.useEffect(effect, []);
