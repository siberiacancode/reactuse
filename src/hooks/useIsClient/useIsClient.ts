import React from 'react';

/** The use is client return type */
/** identifier whether your code is running on client side or on server  */
type UseIsClientReturn = boolean;

/**
 * Hook return value identifying if your code running on client side or on server
 *
 * @returns {UseIsClientReturn} boolean identifier whether your code is running on client side or on server
 */
export const useIsClient = (): UseIsClientReturn => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
