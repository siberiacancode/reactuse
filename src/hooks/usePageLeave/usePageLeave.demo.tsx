import { useCounter } from '@/hooks';

import { usePageLeave } from './usePageLeave';

const Demo = () => {
  const { count, inc } = useCounter(0);

  const isLeft = usePageLeave(() => inc());

  return (
    <>
      <p>
        Mouse left the page: <code>{String(isLeft)}</code>
      </p>
      <p>Count of left the page {count} times</p>
    </>
  );
};

export default Demo;
