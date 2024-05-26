import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

const Demo = () => {
  useIsomorphicLayoutEffect(() => {
    console.log(`useIsomorphicEffect: ${useIsomorphicLayoutEffect.name}`);
  }, []);

  return <div>I am {useIsomorphicLayoutEffect.name}</div>;
};

export default Demo;
