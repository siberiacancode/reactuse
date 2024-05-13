import { useEffect, useRef } from 'react';

export const useUpdateEffect: typeof useEffect = (effect, dependencies) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      effect();
    } else {
      isMounted.current = true;
    }
  }, dependencies);
};
