import { useEventSource } from './useEventSource';

const Demo = () => {
	const { data, status, close, open } = useEventSource(
		'https://example.com/sse',
		['update', 'message'],
		{
			autoReconnect: {
				retries: 3,
				delay: 2000,
				onFailed: () => console.error('Reconnect failed'),
			},
		}
	);

	return (
		<div>
			<p>Status: {status}</p>
			<p>Data: {data}</p>
			<button onClick={close}>Close Connection</button>
			<button onClick={open}>Reconnect</button>
		</div>
	);
}

export default Demo;