import type { CSSProperties } from 'react';

import { usePointerLock } from './usePointerLock';

const Demo = () => {
  const { lock, unlock } = usePointerLock();

  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const elementStyle: CSSProperties = {
    border: '1px solid #949CE0',
    color: '#949CE0',
    padding: '25px',
    cursor: 'move'
  };

  return (
    <div style={containerStyle}>
      <div style={elementStyle} onMouseDownCapture={lock} onMouseUpCapture={unlock}>
        Move me
      </div>
    </div>
  );
};

export default Demo;
