import type { CSSProperties } from 'react';

import { useElementSize } from './useElementSize';

const Demo = () => {
  const elementSize = useElementSize<HTMLTextAreaElement>();

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  };

  const textareaStyle: CSSProperties = {
    resize: 'both',
    width: '200px',
    height: '200px'
  };

  return (
    <div style={containerStyle}>
      <span>Resize the box to see changes</span>
      <textarea
        ref={elementSize.ref}
        style={textareaStyle}
        value={`width: ${elementSize.value.width}\nheight: ${elementSize.value.height}`}
      />
    </div>
  );
};

export default Demo;
