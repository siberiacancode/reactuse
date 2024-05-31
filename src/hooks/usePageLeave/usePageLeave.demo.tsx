import { useState } from 'react';

import { usePageLeave } from './usePageLeave';

const Demo = () => {
  const [leftsCount, setLeftsCount] = useState(0);

  usePageLeave(() => setLeftsCount((prevState) => prevState + 1));

  return <>Mouse left the page {leftsCount} times</>;
};

export default Demo;
