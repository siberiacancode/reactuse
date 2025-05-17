import { useCounter, usePageLeave } from '@siberiacancode/reactuse';

const Demo = () => {
  const counter = useCounter(0);

  const isLeft = usePageLeave(() => counter.inc());

  return (
    <>
      <p>
        Mouse left the page: <code>{String(isLeft)}</code>
      </p>
      <p>Count of left the page {counter.value} times</p>
    </>
  );
};

export default Demo;
