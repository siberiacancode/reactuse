import { useState } from 'react';

import { usePostMessage } from './usePostMessage';

const Demo = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const postMessage = usePostMessage<{ type: 'delete' } | { type: 'send'; value: string }>('*', (message) => {
    console.log('Message received', message);

    if (message.type === 'send') {
      setMessages((prevMessages) => [...prevMessages, message.value]);
    }

    if (message.type === 'delete') {
      setMessages((prevMessages) => prevMessages.slice(0, prevMessages.length - 1));
    }
  });

  const onSendClick = () =>
    postMessage({ type: 'send', value: (Math.random() + 1).toString(36).substring(3) });
  const onDeleteClick = () => postMessage({ type: 'delete' });

  return (
    <>
      <div>
        {messages.length ? 'Messages' : 'No messages'}
        {!!messages.length && (
          <ul>
            {messages.map((message) => (
              <li key={message}>
                <code>{message}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type='button' onClick={onSendClick}>Send message</button>
      <button type='button' onClick={onDeleteClick}>Delete message</button>
    </>
  );
};

export default Demo;
