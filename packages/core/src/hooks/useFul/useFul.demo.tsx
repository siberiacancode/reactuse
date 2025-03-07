import { useCounter } from '../useCounter/useCounter';
import { useFul } from './useFul';

const Demo = () => {
  const counter = useCounter();
  const value = useFul(counter.value);

  return (
    <div>
      <p>
        Useful value is <code>{value}</code>
      </p>

      <button className='button' type='button' onClick={() => counter.inc()}>
        Increment
      </button>
    </div>
  );
};

export default Demo;
