import { useCounter } from '../useCounter/useCounter';

import { useLongPress } from './useLongPress';

const Demo = () => {
  const counter = useCounter();
  const [longPressedRef, longPressing] = useLongPress<HTMLButtonElement>(() => counter.inc());

  return (
    <>
      <p>
        Long pressed: <code>{longPressing.toString()}</code>
      </p>
      <p>
        Clicked: <code>{counter.count}</code>
      </p>
      <button type='button' ref={longPressedRef}>
        Long press
      </button>
    </>
  );
};

export default Demo;
