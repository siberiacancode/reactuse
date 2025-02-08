import { useRafValue } from './useRafValue';

const Demo = () => {
  const [count, setCount] = useRafValue(0);

  return (
    <>
      <p>
        Count: <code>{count}</code>
      </p>
      <button type='button' onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  );
};

export default Demo;
