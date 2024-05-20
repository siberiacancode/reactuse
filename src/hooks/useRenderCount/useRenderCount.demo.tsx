import React from 'react';

import { useRenderCount } from './useRenderCount';

const Demo = () => {
  const [, forceUpdate] = React.useReducer((v) => v + 1, 0);
  const renderCount = useRenderCount();

  return (
    <div>
      <button data-test-id='forct-update-button' onClick={forceUpdate}>
        Force Update
      </button>
      <p>Render count: {renderCount}</p>
    </div>
  );
};

export default Demo;
