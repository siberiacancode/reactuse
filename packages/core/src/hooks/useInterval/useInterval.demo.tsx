import { useInterval } from '@siberiacancode/reactuse';
import { useState } from 'react';

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
  const [word, setWord] = useState(GREETINGS[0]);
  const [interval, setInterval] = useState(500);

  const { active, resume, pause } = useInterval(
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
          type='number'
          value={interval}
          onChange={(event) => setInterval(Number(event.target.value))}
        />
      </p>
      {active ? (
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
