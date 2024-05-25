import React, { useState } from 'react';

import { useRenderCount } from '../useRenderCount/useRenderCount';

import { useNonInitialEffect } from './useNonInitialEffect';

const Demo = () => {
  const renderCount = useRenderCount();
  const [value, setValue] = useState(0);

  useNonInitialEffect(() => {
    alert(`useNonInitialEffect triggered`);
  }, [value]);

  return (
    <div>
      <p>
        Current render: <code>{renderCount || 'initial'}</code>
      </p>
      <button type='button' onClick={() => setValue(value + 1)}>
        Force Update
      </button>
    </div>
  );
};

export default Demo;
