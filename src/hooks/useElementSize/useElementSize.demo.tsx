import type { CSSProperties } from 'react';

import { useRef } from 'react';

import { useElementSize } from './useElementSize';

const Demo = () => {
  const element = useRef<HTMLTextAreaElement>(null);

  const { height, width } = useElementSize(element);

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
      <textarea ref={element} style={textareaStyle} value={`width: ${width}\nheight: ${height}`} />
    </div>
  );
};

export default Demo;
