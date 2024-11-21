import type { EffectCallback } from 'react';

import { useEffect } from 'react';

/**
 * @name useMount
 * @description - Hook that executes a callback when the component mounts
 * @category Lifecycle
 *
 * @param {EffectCallback} effect The callback to execute
 *
 * @example
 * useMount(() => console.log('This effect runs on the initial render'));
 */
export const useMount = (effect: EffectCallback) => useEffect(effect, []);
