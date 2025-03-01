import { useCounter } from '../useCounter/useCounter';
import { useLess } from './useLess';

const Demo = () => {
  const counter = useCounter();
  const value = useLess(counter.value);

  return (
    <div>
      <div className='rounded-xl bg-amber-50 p-4 text-amber-500'>
        <strong>Warning:</strong> This hook is a joke. Please do not use it in production code!
      </div>

      <p>
        Useless value is <code>{value}</code>
      </p>

      <button className='button' type='button' onClick={() => counter.inc()}>
        Increment
      </button>
    </div>
  );
};

export default Demo;
