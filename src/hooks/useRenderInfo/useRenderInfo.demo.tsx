import { useState } from 'react';

import { useRenderInfo } from './useRenderInfo';

const Demo = () => {
  const [counter, setCounter] = useState(0);
  const renderInfo = useRenderInfo('My component');

  return (
    <div>
      <p>Component render information:</p>
      <p>Name: {renderInfo.component}</p>
      <p>Count renders: {renderInfo.renders}</p>
      <p>Since last render: {renderInfo.sinceLast}</p>
      <p>Timestamp: {renderInfo.timestamp}</p>
      {/* eslint-disable-next-line no-return-assign */}
      <button onClick={() => setCounter((prevState) => (prevState += 1))}>
        RERENDER {counter}
      </button>
    </div>
  );
};

export default Demo;
