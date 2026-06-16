import { useIsomorphicLayoutEffect } from '@siberiacancode/reactuse';

const Demo = () => {
  useIsomorphicLayoutEffect(() => {
    console.log(`log: useLayoutEffect`);
  }, []);

  return (
    <div>
      I am <b>useLayoutEffect</b>
    </div>
  );
};

export default Demo;
