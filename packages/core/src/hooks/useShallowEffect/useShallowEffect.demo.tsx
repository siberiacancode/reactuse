import { useRerender, useShallowEffect } from '@siberiacancode/reactuse';
import { useEffect, useRef } from 'react';

const Demo = () => {
  const rerender = useRerender();
  const object = {};

  const useEffectCounter = useRef(0);
  const useShallowEffectCounter = useRef(0);

  useEffect(() => {
    useEffectCounter.current++;
  }, [object]);

  useShallowEffect(() => {
    useShallowEffectCounter.current++;
  }, [object]);

  return (
    <>
      <p>
        use effect render count: <code>{useEffectCounter.current}</code>
      </p>
      <p>
        use shallow effect render count: <code>{useShallowEffectCounter.current}</code>
      </p>

      <button onClick={rerender}>Rerender</button>
    </>
  );
};

export default Demo;
