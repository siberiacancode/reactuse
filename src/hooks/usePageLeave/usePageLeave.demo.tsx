import { useCounter } from '@/hooks';

import { usePageLeave } from './usePageLeave';

const Demo = () => {
  const { count, inc } = useCounter(0);

  usePageLeave(() => inc(1));

  return <>Mouse left the page {count} times</>;
};

export default Demo;
