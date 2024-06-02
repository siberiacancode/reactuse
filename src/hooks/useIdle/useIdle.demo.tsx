import { useIdle } from './useIdle';

const Demo = () => {
  const { idle, lastActive } = useIdle(1000);

  return (
    <>
      <p>
        Status: <code style={{ color: idle ? 'red' : 'green' }}>{idle ? 'idle' : 'active'}</code>
      </p>
      <p>Last active: {lastActive}</p>
    </>
  );
};

export default Demo;
