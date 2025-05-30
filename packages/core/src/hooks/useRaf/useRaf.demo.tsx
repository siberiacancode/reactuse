import { useCounter, useRaf } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter();
  const { active, resume, pause } = useRaf(() => counter.inc());

  return (
    <>
      <p>
        Count: <code>{counter.value}</code>
      </p>

      {active ? (
        <button type='button' onClick={pause}>
          Pause
        </button>
      ) : (
        <button type='button' onClick={resume}>
          Resume
        </button>
      )}
    </>
  );
};

export default Demo;
