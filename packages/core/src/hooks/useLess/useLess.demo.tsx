import { useCounter, useLess } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();
  const value = useLess(counter.value);

  return (
    <div>
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
