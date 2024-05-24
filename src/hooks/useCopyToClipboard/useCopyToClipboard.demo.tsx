import React from 'react';

import { useCopyToClipboard } from './useCopyToClipboard';

const Demo = () => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const handleCopy = (value: string) => () => {
    copyToClipboard(value)
      .then(() => {
        console.log('Copied!', { value });
      })
      .catch((error) => {
        console.error('Failed to copy!', error);
      });
  };

  return (
    <>
      <p>Click to copy:</p>
      <div style={{ display: 'flex' }}>
        <button type='button' onClick={handleCopy('A')}>
          A
        </button>
        <button type='button' onClick={handleCopy('B')}>
          B
        </button>
        <button type='button' onClick={handleCopy('C')}>
          C
        </button>
      </div>
      <p>Copied value: {copiedText ?? 'Nothing is copied yet!'}</p>
      <input type='text' placeholder='Paste here' />
    </>
  );
};

export default Demo;
