import { useEventSource } from './useEventSource';

const Demo = () => {
  const eventSource = useEventSource('https://sse.dev/test', ['update', 'message']);

  return (
    <div>
      <p>
        Status:{' '}
        <code>
          {eventSource.isConnecting ? 'CONNECTING' : eventSource.isOpen ? 'OPEN' : 'CLOSED'}
        </code>
      </p>
      {eventSource.isConnecting && <p>Connecting...</p>}
      {eventSource.isOpen && <p>Data: {eventSource.data}</p>}

      {eventSource.isOpen && <button onClick={eventSource.close}>Close</button>}
      {!eventSource.isOpen && <button onClick={eventSource.open}>Reconnect</button>}
    </div>
  );
};

export default Demo;
