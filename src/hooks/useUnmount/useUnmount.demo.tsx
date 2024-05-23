import React from 'react';

import { useBoolean } from '../useBoolean/useBoolean';

import { useUnmount } from './useUnmount';

const Component = () => {
  useUnmount(() => alert('unmount'));

  return <p>Hello World!</p>;
};

const Demo = () => {
  const [on, toggle] = useBoolean(true);

  return (
    <>
      <button type='button' onClick={() => toggle()}>
        {on ? 'unmount' : 'mount'}
      </button>
      {on && <Component />}
    </>
  );
};

export default Demo;
