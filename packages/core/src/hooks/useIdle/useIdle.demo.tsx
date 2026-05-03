import { useIdle } from '@siberiacancode/reactuse';

import { cn } from '@/utils/lib';

const Demo = () => {
  const { idle, lastActive } = useIdle(1000);

  return (
    <>
      <p>
        Status:{' '}
        <code>
          <span className={cn('text-red-300', { 'text-green-300': !idle })}>
            {idle ? 'idle' : 'active'}
          </span>
        </code>
      </p>
      <p>Last active: {lastActive}</p>
    </>
  );
};

export default Demo;
