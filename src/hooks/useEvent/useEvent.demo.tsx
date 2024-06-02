import React from 'react';

import { useCounter } from '../useCounter/useCounter';
import { useRenderCount } from '../useRenderCount/useRenderCount';

import { useEvent } from './useEvent';

interface MemoComponentProps {
  onClick: () => void;
}

const MemoComponent = React.memo(({ onClick }: MemoComponentProps) => {
  const rerenderCount = useRenderCount();

  return (
    <>
      <p>
        Memo component rerender count: <code>{rerenderCount}</code>
      </p>
      <button type='button' onClick={onClick}>
        Send message
      </button>
    </>
  );
});

const Demo = () => {
  const counter = useCounter();

  const onClick = useEvent(() => counter.inc());

  return (
    <>
      <p>
        Count is: <code>{counter.count}</code>
      </p>
      <MemoComponent onClick={onClick} />
    </>
  );
};

export default Demo;
