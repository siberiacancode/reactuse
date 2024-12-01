import type { CSSProperties } from 'react';

import { useTextDirection } from './useTextDirection';

const Demo = () => {
  const [dir, set] = useTextDirection({ selector: '#_useTextDirectionDemo' });

  const buttonContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    color: 'gray'
  };

  return (
    <div id='_useTextDirectionDemo'>
      <p>
        {dir === 'ltr' && 'This paragraph is left-to-right text.'}
        {dir === 'rtl' && 'This paragraph is right-to-left text.'}
      </p>
      <hr />
      <div style={buttonContainerStyle}>
        <button type='button' onClick={() => set(dir === 'ltr' ? 'rtl' : 'ltr')}>
          {dir === 'ltr' && 'LTR'}
          {dir === 'rtl' && 'RTL'}
        </button>
        <span>Click to change the direction</span>
      </div>
    </div>
  );
};

export default Demo;
