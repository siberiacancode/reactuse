import React from 'react';

import { useIsomorphicEffect } from './useIsomorphicEffect';

const Demo = () => {
  useIsomorphicEffect(() => {
    console.log(`useIsomorphicEffect: ${useIsomorphicEffect.name}`);
  }, []);

  return <div>I am {useIsomorphicEffect.name}</div>;
};

export default Demo;
