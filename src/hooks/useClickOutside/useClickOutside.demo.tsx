import React from 'react';

import { useClickOutside } from './useClickOutside';

const Demo = () => {
  const ref = useClickOutside<HTMLDivElement>((event) => {
    console.log('@click outside', event.target);
  });

  // const ref = React.useRef<HTMLDivElement>(null);
  // useOnClickOutside(ref, () => {
  //   console.log('@click outside');
  // });

  return (
    <div
      id='content'
      ref={ref}
      style={{
        width: 200,
        height: 200,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid red'
      }}
    >
      content
    </div>
  );
};

export default Demo;
