import React from 'react';

import { useWindowSize } from './useWindowSize';

const Demo = () => {
  const size = useWindowSize();

  return (
    <div>
      <p>Current window size:</p>
      <p>
        <span>
          width: <b>{size.width}</b>
        </span>{' '}
        <span>
          height: <b>{size.height}</b>
        </span>
      </p>
    </div>
  );
};

export default Demo;
