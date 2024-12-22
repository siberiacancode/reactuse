import type { CSSProperties } from 'react';

import { useTextDirection } from './useTextDirection';

const Demo = () => {
  const textDirection = useTextDirection<HTMLDivElement>();

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    color: 'gray'
  };

  return (
    <div ref={textDirection.ref}>
      <p>
        {textDirection.value === 'ltr' && 'This paragraph is left-to-right text.'}
        {textDirection.value === 'rtl' && 'This paragraph is right-to-left text.'}
      </p>
      <hr />
      <div style={buttonContainerStyle}>
        <button type='button' onClick={() => textDirection.set(textDirection.value === 'ltr' ? 'rtl' : 'ltr')}>
          {textDirection.value === 'ltr' && 'LTR'}
          {textDirection.value === 'rtl' && 'RTL'}
        </button>
        <span>Click to change the direction</span>
      </div>
    </div>
  );
};

export default Demo;
