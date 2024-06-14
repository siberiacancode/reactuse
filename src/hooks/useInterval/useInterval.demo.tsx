import React from 'react';

import { useInterval } from './useInterval';

const GREETINGS = [
  'Hello',
  'Hi',
  'Yo!',
  'Hey',
  'Hola',
  'こんにちは',
  'Bonjour',
  'Salut!',
  '你好',
  'Привет'
];

const Demo = () => {
  const [word, setWord] = React.useState(GREETINGS[0]);
  const [interval, setInterval] = React.useState(500);

  const { isActive, resume, pause } = useInterval(
    () => setWord(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]),
    interval
  );

  return (
    <div>
      <p>
        <code>{word}</code>
      </p>
      <p>
        interval: {interval}
        <input
          value={interval}
          onChange={(event) => setInterval(Number(event.target.value))}
          type='number'
        />
      </p>
      {isActive ? (
        <button type='button' onClick={pause}>
          Pause
        </button>
      ) : (
        <button type='button' onClick={resume}>
          Resume
        </button>
      )}
    </div>
  );
};

export default Demo;
