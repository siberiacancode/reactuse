import { useCounter } from '../useCounter/useCounter';
import { useLongPress } from './useLongPress';

const Demo = () => {
  const counter = useCounter();
  const [bind, longPressing] = useLongPress(() => counter.inc());

  return (
    <>
      <p>
        Long pressed: <code>{longPressing.toString()}</code>
      </p>
      <p>
        Clicked: <code>{counter.value}</code>
      </p>
      <button type='button' {...bind}>
        Long press
      </button>
    </>
  );
};

export default Demo;
