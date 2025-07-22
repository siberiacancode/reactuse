import { useAutoScroll } from '@siberiacancode/reactuse';
import { useState } from 'react';

const Demo = () => {
  const [messages, setMessages] = useState([`Message 1 at ${new Date().toLocaleTimeString()}`]);

  const listRef = useAutoScroll<HTMLUListElement>();

  const onAddMessage = () =>
    setMessages((prev) => [
      ...prev,
      `Message ${prev.length + 1} at ${new Date().toLocaleTimeString()}`
    ]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          Messages count: <code>{messages.length}</code>
        </div>

        <button
          className='rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          type='button'
          onClick={onAddMessage}
        >
          Add
        </button>
      </div>

      <ul
        ref={listRef}
        className='p-0! list-none! scroll-smooth! flex h-[200px] flex-col gap-1 overflow-y-auto'
      >
        {messages.map((message, index) => (
          <li key={index} className='rounded border p-2'>
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Demo;
