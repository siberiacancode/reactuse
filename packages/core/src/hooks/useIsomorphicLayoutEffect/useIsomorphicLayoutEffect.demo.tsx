import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

const Demo = () => {
  useIsomorphicLayoutEffect(() => {
    console.log(`log: useLayoutEffect`);
  }, []);

  return <div>I am <code>useLayoutEffect</code></div>;
};

export default Demo;
