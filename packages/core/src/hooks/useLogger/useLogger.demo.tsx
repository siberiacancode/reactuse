import { useLogger } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [count, setCount] = useState(0);

  useLogger('Demo', [count, { foo: 'bar' }]);

  return (
    <div>
      <p>
        Open the <code>console</code> to see the logger output
      </p>
      <button type='button' onClick={() => setCount(count + 1)}>
        Update state
      </button>
    </div>
  );
};

export default Demo;
