import { memo } from 'react';

import { useCounter, useRenderCount, useEvent } from '@siberiacancode/reactuse';

interface MemoComponentProps {
  onClick: () => void;
}

const MemoComponent = memo(({ onClick }: MemoComponentProps) => {
  const renderCount = useRenderCount();

  return (
    <>
      <p>
        Memo component rerender count: <code>{renderCount}</code>
      </p>
      <button type='button' onClick={onClick}>
        Send message
      </button>
    </>
  );
});
MemoComponent.displayName = 'MemoComponent';

const Demo = () => {
  const counter = useCounter();

  const onClick = useEvent(() => counter.inc());

  return (
    <>
      <p>
        Count is: <code>{counter.value}</code>
      </p>
      <MemoComponent onClick={onClick} />
    </>
  );
};

export default Demo;
