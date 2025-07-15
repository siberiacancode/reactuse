import { useBroadcastChannel, useConst } from '@siberiacancode/reactuse';

const Demo = () => {
  const broadcastChannel = useBroadcastChannel<string>('demo-channel', (data) =>
    alert(`Received message: ${data}`)
  );

  const id = useConst(Math.random().toString(36).slice(2, 7));

  if (!broadcastChannel.supported) {
    return (
      <p>
        Api not supported, make sure to check for compatibility with different browsers when using
        this{' '}
        <a
          href='https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel'
          rel='noreferrer'
          target='_blank'
        >
          api
        </a>
      </p>
    );
  }

  return (
    <div>
      <p>
        This is window <code>{id}</code>
      </p>
      <p>Open multiple browser windows/tabs to test cross-window communication</p>

      <div style={{ marginBottom: '1rem' }}>
        <button type='button' onClick={() => broadcastChannel.post(`Hello from window ${id}!`)}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Demo;
