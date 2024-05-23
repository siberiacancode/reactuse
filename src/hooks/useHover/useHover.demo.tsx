import React from 'react';

import { useHover } from './useHover';

const Demo = () => {
  const hoverRef = React.useRef<HTMLDivElement>(null);
  const isHover = useHover(hoverRef, () => console.log('@callback'));

  return <div ref={hoverRef}>The current div is {isHover ? `hovered` : `unhovered`}</div>;
};

export default Demo;
