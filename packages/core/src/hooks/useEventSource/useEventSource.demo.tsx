import { useEventSource } from './useEventSource';

const Demo = () => {
  const eventSource = useEventSource('https://sse.dev/test', ['update', 'message']);

  return (
    <div>
      <p>
        Status:{' '}
        <code>
          {eventSource.isConnecting ? 'CONNECTING' : eventSource.opened ? 'OPEN' : 'CLOSED'}
        </code>
      </p>
      {eventSource.isConnecting && <p>Connecting...</p>}
      {eventSource.opened && <p>Data: {eventSource.data}</p>}

      {eventSource.opened && <button onClick={eventSource.close}>Close</button>}
      {!eventSource.opened && <button onClick={eventSource.open}>Reconnect</button>}
    </div>
  );
};

export default Demo;
