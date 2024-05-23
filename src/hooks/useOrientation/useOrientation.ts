import { useState } from 'react';

import { useIsomorphicLayoutEffect } from '../useIsomorphicLayoutEffect/useIsomorphicLayoutEffect';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<{
    angle: number;
    type: OrientationType;
  }>({ angle: 0, type: 'landscape-primary' });

  useIsomorphicLayoutEffect(() => {
    const onChange = () => {
      const { angle, type } = window.screen.orientation;
      setOrientation({
        angle,
        type
      });
    };

    window.screen.orientation?.addEventListener('change', onChange);
    return () => window.screen.orientation?.removeEventListener('change', onChange);
  }, []);

  return orientation;
};
