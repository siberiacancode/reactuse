import { useIsFirstRender } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const isFirstRender = useIsFirstRender();
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Rerendered {count} times</p>
      <p>
        Is first render: <code>{isFirstRender ? 'yes' : 'no'}</code>
      </p>
      <button type='button' onClick={() => setCount(count + 1)}>
        Rerender
      </button>
    </div>
  );
};

export default Demo;
