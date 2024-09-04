import { useTimeout } from './useTimeout';

const Demo = () => {
  const timeout = useTimeout(() => console.log('ready'), 5000);

  return (
    <div>
      <p>
        Timeout ready: <code>{String(timeout.ready)}</code>
      </p>
      <button onClick={timeout.clear}>Clear</button>
    </div>
  );
};

export default Demo;
