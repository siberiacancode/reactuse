import { useCounter, useKeyPressEvent } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter(0);

  useKeyPressEvent('Enter', () => counter.inc());

  return (
    <div>
      <p>
        Press <code>Enter</code> key
      </p>
      <p>
        Count of key presses: <code>{counter.value}</code>
      </p>
    </div>
  );
};

export default Demo;
