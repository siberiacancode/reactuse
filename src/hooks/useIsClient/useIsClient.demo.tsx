import React from 'react';

import { useIsClient } from './useIsClient';

const Demo = () => {
  const isClient = useIsClient();

  return (
    <div>
      <p>Is this code running on client: {String(isClient)}</p>
    </div>
  );
};

export default Demo;
