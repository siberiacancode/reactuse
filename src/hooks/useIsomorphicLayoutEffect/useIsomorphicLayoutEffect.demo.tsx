import React from 'react';
import { useIsomorphicLayoutEffect } from '@siberiacancode/reactuse';

const Demo = () => {
  useIsomorphicLayoutEffect(() => {
    console.log(`useIsomorphicEffect: ${useIsomorphicLayoutEffect.name}`);
  }, []);

  return <div>I am {useIsomorphicLayoutEffect.name}</div>;
};

export default Demo;
