import { useState } from 'react';

import { useDebounceValue } from '../useDebounceValue/useDebounceValue';
import { useMount } from '../useMount/useMount';
import { useSpeechSynthesis } from './useSpeechSynthesis';

const Demo = () => {
  const [text, setText] = useState('Hello, everyone! This is a demo!');
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const { isSupported, status, speak, stop, toggle } = useSpeechSynthesis({
    text: useDebounceValue(text, 300),
    voice,
    pitch: useDebounceValue(pitch, 300),
    rate: useDebounceValue(rate, 300)
  });

  useMount(() => {
    if (isSupported) {
      const timeout = setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        setVoice(voices[0]);
        setVoices(voices);
      }, 100);

      return () => clearTimeout(timeout);
    }
  });

  return (
    <>
      <p>
        supported: <code>{String(isSupported)}</code>
      </p>
      {isSupported && (
        <>
          <div>
            <label htmlFor='text'>Text to speak</label>
            <textarea id='text' value={text} onChange={(event) => setText(event.target.value)} />
          </div>
          <div>
            <label htmlFor='voice'>Voice</label>
            <select
              id='voice'
              value={voice?.name ?? ''}
              onChange={(event) =>
                setVoice(voices.find((voice) => voice.name === event.target.value) ?? null)
              }
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='pitch'>Pitch</label>
            <input
              id='pitch'
              max={2}
              min={0}
              step={0.1}
              style={{ padding: 0 }}
              type='range'
              value={pitch}
              onChange={(event) => setPitch(Number(event.target.value))}
            />
          </div>
          <div>
            <label htmlFor='rate'>Rate</label>
            <input
              id='rate'
              max={2}
              min={0}
              step={0.1}
              style={{ padding: 0 }}
              type='range'
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </div>
          <div>
            <button type='button' onClick={speak}>
              Speak
            </button>
            <button type='button' onClick={stop}>
              Stop
            </button>
          </div>
          <div>
            <button disabled={status !== 'play'} type='button' onClick={() => toggle(false)}>
              Pause
            </button>
            <button disabled={status !== 'pause'} type='button' onClick={() => toggle(true)}>
              Resume
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Demo;
