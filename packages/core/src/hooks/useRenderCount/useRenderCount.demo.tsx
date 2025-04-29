import { useRenderCount } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const renderCount = useRenderCount();
  const [value, setValue] = useState(0);

  return (
    <div>
      <p>Render count: {renderCount}</p>
      <button type='button' onClick={() => setValue(value + 1)}>
        Force Update
      </button>
    </div>
  );
};

export default Demo;
