import { useState } from 'react';

import { useField } from '../useField/useField';
import { useWebSocket } from './useWebSocket';

interface Message {
  date: Date;
  text: string;
  type: 'client' | 'server';
}

const Demo = () => {
  const messageInput = useField({ initialValue: '' });

  const [messages, setMessages] = useState<Message[]>([
    { text: 'Connecting to chat...', type: 'server', date: new Date() }
  ]);

  const webSocket = useWebSocket('wss://echo.websocket.org', {
    onConnected: (webSocket) =>
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Connected to ${webSocket.url}`, type: 'server', date: new Date() }
      ]),
    onMessage: (event) =>
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: event.data, type: 'server', date: new Date() }
      ]),
    onDisconnected: () =>
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Disconnected', type: 'server', date: new Date() }
      ])
  });

  return (
    <>
      <p>
        Status: <code>{webSocket.status}</code>
      </p>

      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <span>
              <code>
                {message.date.toLocaleTimeString()} {message.type}
              </code>{' '}
            </span>
            {message.text}
          </div>
        ))}
      </div>

      <input type='text' {...messageInput.register()} />
      <button
        disabled={webSocket.status !== 'connected'}
        type='button'
        onClick={() => {
          const message = messageInput.getValue();
          setMessages([
            ...messages,
            { text: messageInput.getValue(), type: 'client', date: new Date() }
          ]);
          webSocket.send(message);
          messageInput.reset();
        }}
      >
        Send
      </button>
      {webSocket.status === 'connected' && (
        <button type='button' onClick={() => webSocket.close()}>
          Disconnect
        </button>
      )}
      {webSocket.status === 'disconnected' && (
        <button type='button' onClick={() => webSocket.open()}>
          Connect
        </button>
      )}
    </>
  );
};

export default Demo;
