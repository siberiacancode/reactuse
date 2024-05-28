import { useScript } from './useScript';

const Demo = () => {
  const status = useScript('https://unpkg.com/react@18/umd/react.development.js', {
    async: true,
    onLoad: () => console.log('script is ready'),
    onError: () => console.error('script failed to load')
  });

  return (
    <div>
      <p>
        Current status: <code>{status}</code>
      </p>

      {status === 'loading' && <p>Loading...</p>}
      {status === 'ready' && <p>You can use the script</p>}
    </div>
  );
};

export default Demo;
