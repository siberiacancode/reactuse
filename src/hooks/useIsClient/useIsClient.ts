import { isClient } from '@/utils/helpers';

/**
 * @name useIsClient
 * @description - Hook return value identifying if your code running on client side or on server
 *
 * @returns {boolean} A value identifier whether your code is running on client side or on server
 *
 * @example
 * const isClient = useIsClient();
 */
export const useIsClient = () => isClient;
