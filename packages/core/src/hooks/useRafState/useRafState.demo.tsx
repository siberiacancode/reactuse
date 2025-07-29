import { useRafState } from '@siberiacancode/reactuse';

const Demo = () => {
  const [count, setCount] = useRafState(0);

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
